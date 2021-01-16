const Service = require('../Service')
const crypto = require('crypto')

class WebhookService  extends Service{
  _headersRequiredFields = ['x-hub-signature']
  _appSecretKey = process.env.FB_APP_SECRET_KEY

  constructor(){
    super()
  }

  async createSignatureValue(){

  }

  async checkSignature(headers, body){
    await this._checkRequiredFields(this._headersRequiredFields, headers)
    const payload = JSON.stringify(body)
    const hmac = crypto.createHmac('sha1', this._appSecretKey)
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
    const checksum = Buffer.from(headers['x-hub-signature'], 'utf8')
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
      await this._throwInvalidParamError("x-hub-signature")
    }
    console.log("SUCESSO")
  }
 
}

module.exports = WebhookService