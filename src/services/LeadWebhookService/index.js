const Service = require('../Service')

class LeadWebhookService extends Service {
  _subRequiredFields = ['hub.mode', 'hub.verify_token', 'hub.challenge']

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
    return fields
  }

}

module.exports = LeadWebhookService