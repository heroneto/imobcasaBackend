const Service = require('../Service')
const crypto = require('crypto')

class WebhookService  extends Service{
  _headersRequiredFields = ['x-hub-signature']
  _appSecretKey = process.env.FB_APP_SECRET_KEY

  constructor(){
    super()
  }



  _createDigest(body){
    const payload = JSON.stringify(body)
    const hmac = crypto.createHmac('sha1', this._appSecretKey)
    return Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
  }

  _createChecksum(xHubSignature){
    return Buffer.from(xHubSignature, 'utf8')
  }


  async checkSignature(headers, body){
    await this._checkRequiredFields(this._headersRequiredFields, headers)
    await this._checkBodyExists(body)
    const digest = this._createDigest(body)
    const checksum = this._createChecksum(headers['x-hub-signature'])
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
      await this._throwInvalidParamError("x-hub-signature")
    }
  }
 
}

module.exports = WebhookService