const Service = require('../Service')

class LeadWebhookService extends Service {
  _subRequiredFields = ['hub.mode', 'hub.verify_token', 'hub.challenge']
  _addLeadRequiredFields = [ 
    "ad_id",
    "form_id",
    "leadgen_id",
    "created_time",
    "page_id",
    "adgroup_id",
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
    const { changes } = fields.entry
    this._checkFieldExists(changes, 'changes')
    if(changes.length === 0){
      this._throwInvalidParamError("changes")
    }
  }

  checkChangesFields(){
    
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
    
    return fields
  }

}

module.exports = LeadWebhookService