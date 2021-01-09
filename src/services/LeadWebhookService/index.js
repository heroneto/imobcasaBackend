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
    return true
  }

}

module.exports = LeadWebhookService