const Service = require('../Service')
const { getLead } = require('../apis')
const { 
    UserFormRepository, 
    FormRepository, 
    LeadSourceRepository, 
    LeadStatusRepository,
    LeadRepository
  } = require('../../repositories')

class LeadWebhookService extends Service {
  _subRequiredFields = ['hub.mode', 'hub.verify_token', 'hub.challenge']
  _addLeadValueRequiredFields = [
    "form_id",
    "leadgen_id",
    "created_time",
    "page_id"
  ]
  constructor() {
    super()
    this._userFormRepository = new UserFormRepository()
    this._formRepository = new FormRepository()
    this._leadSourceRepository = new LeadSourceRepository()
    this._leadStatusRepository = new LeadStatusRepository()
    this._leadRepository = new LeadRepository()
  }



  _checkEntryField(fields) {
    const { entry } = fields
    this._checkFieldExists(entry, 'entry')
    if (entry.length === 0) {
      this._throwInvalidParamError("entry")
    }
  }

  _checkChangesField(fields) {
    const { entry: entries } = fields
    for (const entry of entries) {
      const { changes } = entry
      this._checkFieldExists(changes, 'changes')
      if (changes.length === 0) {
        this._throwInvalidParamError("changes")
      }
    }

  }

  _checkValueField(fields) {
    const { entry: entries } = fields
    for (const entry of entries) {
      const { changes } = entry
      for (const change of changes) {
        const { value } = change
        this._checkFieldExists(value, 'value')
      }
    }
  }

  _checkRequiredValueFields(fields) {
    const { entry: entries } = fields
    for (const entry of entries) {
      const { changes } = entry
      for (const change of changes) {
        const { value } = change
        this._checkRequiredFields(this._addLeadValueRequiredFields, value)
      }
    }
  }

  _extractLeadAndFormIds(fields){
    const data = []
    const { entry: entries } = fields
    for (const entry of entries) {
      const { changes } = entry
      for (const change of changes) {
        const { value } = change
        data.push({
          leadgenId: value.leadgen_id,
          fbFormID: value.form_id
        })
      }
    }
    return data
  }

  _mergeFormAndLeadData(forms = [], leadData = []){
    return leadData.map(lead => {
      const form = forms.find(form => form.leadgenId === lead.leadgenId)
      return {
        ...lead,
        fbFormID: form.fbFormID
      }
    })
  }

  async _requestLeadData(leadsData = [], token) {
    let results = []
    for (const lead of leadsData) {
      //call api request
      results.push(await getLead(lead.leadgenId, token))
    }
    return results
  }

  _extractLeadData(leadsReceived) {
    const data = leadsReceived.map(lead => {
      const [ fullNameField, phoneNumberField ] = lead.field_data
      const [ name ] = fullNameField.values
      const [ phone ] = phoneNumberField.values
      return {
        leadgenId: lead.id,
        name,
        phone
      }
    })
    return data
  }
  
  async _getUserToDistribute(formId){
    let usersForms = await this._userFormRepository.getActiveUserToDistibute(formId)
    if(!usersForms){
      usersForms = await this._userFormRepository.getInactiveUserToDistibute(formId)
    }
    if(usersForms){
      await this._userFormRepository.disable(usersForms)
      await this._userFormRepository.updateLastLeadReceivedTime(usersForms)
    }
    return usersForms
  }

  _normalizeLeadData(lead, statusid, sourceid, formid, userid){
    Reflect.deleteProperty(lead, 'leadgenId')
    Reflect.deleteProperty(lead, 'fbFormID')

    return {
      ...lead,
      userid,
      statusid,
      sourceid,
      formid,
      active: true,
      negociationStartedAt: Date.now()
    }
  }

  async subscrive(fields) {
    await this._checkRequiredFields(this._subRequiredFields, fields)
    if (fields['hub.mode'] !== "subscrive") {
      this._throwInvalidParamError('hub.mode')
    }
    if (fields['hub.verify_token'] !== process.env.FB_SUB_TOKEN) {
      this._throwInvalidParamError('hub.verify_token')
    }
    return fields['hub.challenge']
  }

  async addLead(fields) {
    const FB_APP_TOKEN = process.env.FB_APP_TOKEN
    this._checkEntityExsits(FB_APP_TOKEN, "appAccessToken")
    this._checkEntryField(fields)
    this._checkChangesField(fields)
    this._checkValueField(fields)
    this._checkRequiredValueFields(fields)
    const leadAndFormIds = this._extractLeadAndFormIds(fields)
    const result = await this._requestLeadData(leadAndFormIds, FB_APP_TOKEN)
    let leadsData = this._extractLeadData(result)
    leadsData = this._mergeFormAndLeadData(leadAndFormIds, leadsData)
    
    const { id: leadSourceID }  = await this._leadSourceRepository.getFacebookSourceID()
    const { id: leadStatusID }  = await this._leadStatusRepository.getBacklogStatusID()

    let leadsCreated = []
    for(const lead of leadsData){
      const form = await this._formRepository.getByFBFormID(lead?.fbFormID)
      if(form){
        const usersForms = await this._getUserToDistribute(form.id)
        const leadNormalized = this._normalizeLeadData(
            lead, 
            leadStatusID, 
            leadSourceID, 
            form.id, 
            usersForms?.userid ? usersForms?.userid : null
            )
        const leadCreated = await this._leadRepository.findOrCreateLead(leadNormalized)
        leadsCreated.push(leadCreated[0])
      }

    }


    return leadsCreated

    /**
     * 1 - Extrair Ids dos Leads para coleta na API
     * 2 - Coletar Token para coleta na API
     * 3 - Resultado da API
     * 4 - Dados dos Leads extraídos da API
     * 5 - Dados dos Leads unificados com Form
     * 6 - Para cada Lead
     *  1 - coletar FormID pelo fbFormID
     *  2 - Atribuir UserID com base em regra de distribuição.
     *  3 - add: formid, sourceid, statusid,  active=true, negociationStartedAt
     * 7 - Retornar Leads
     */
  }

}

module.exports = LeadWebhookService