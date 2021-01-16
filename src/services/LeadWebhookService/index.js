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
    //verificar campos requeridos
    //
    await this._checkRequiredFields(this._addLeadRequiredFields, fields.value)
    return fields
  }

}

module.exports = LeadWebhookService