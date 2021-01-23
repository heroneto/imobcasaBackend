const Service = require('../Service')

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
  }



  _checkEntryField(fields){
    const { entry } = fields    
    this._checkFieldExists(entry, 'entry')
    if(entry.length === 0){
      this._throwInvalidParamError("entry")
    }
  }

  _checkChangesField(fields){
    const { entry: entries } = fields
    for(const entry of entries){
      const { changes } = entry
      this._checkFieldExists(changes, 'changes')
      if(changes.length === 0){
        this._throwInvalidParamError("changes")
      }
    }

  }

  _checkValueField(fields){
    const { entry: entries } = fields
    for(const entry of entries){
      const { changes } = entry
      for(const change of changes){
        const { value } = change
        this._checkFieldExists(value, 'value')
      }
    }
  }

  _checkRequiredValueFields(fields){
    const { entry: entries } = fields
    for(const entry of entries){
      const { changes } = entry
      for(const change of changes){
        const { value } = change
        this._checkRequiredFields(this._addLeadValueRequiredFields, value)
      }
    }
  }

  _getLeadIds(fields){
    const ids = []
    const { entry: entries } = fields
    for(const entry of entries){
      const { changes } = entry
      for(const change of changes){
        const { value } = change
        ids.push(value.leadgen_id)
      }
    }
    return ids
  }

  async _requestLeadData(ids = []){
    for(const id of ids){
      //call api request
    }
  }

  async subscrive(fields) {
    await this._checkRequiredFields(this._subRequiredFields, fields)
    if(fields['hub.mode'] !== "subscrive"){
      this._throwInvalidParamError('hub.mode')
    }
    if(fields['hub.verify_token'] !== process.env.FB_SUB_TOKEN){
      this._throwInvalidParamError('hub.verify_token')
    }
    return fields['hub.challenge']
  }

  async addLead(fields){
    
    /*
      1 - Validar existência de Entry
      2 - Validar tamanho do entry
      Para cada entry:
        1 - Validar existência de changes
        2 - Validar tamanho do Changes
        Para cada Changes: 
          1 - Validar exitência de value
          dentro de value:
            1 - Validar existência de requiredFields
    */
    this._checkEntryField(fields)
    this._checkChangesField(fields)
    this._checkValueField(fields)
    this._checkRequiredValueFields(fields)
    const leadsIds = this._getLeadIds(fields)
    const leadsData = this._requestLeadData(leadIds)


    return fields
  }

}

module.exports = LeadWebhookService