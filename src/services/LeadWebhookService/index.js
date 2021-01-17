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
    this._checkEntityExsits(entry, 'entry')
  }

  _checkChangesField(){

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
    
    return fields
  }

}

module.exports = LeadWebhookService