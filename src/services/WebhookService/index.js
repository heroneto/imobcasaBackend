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
    return crypto.createHmac('sha1', this._appSecretKey).update(payload).digest('hex')
  }

  _createDigestBuffer(digest){
    return Buffer.from(digest, 'utf8')
  }

  _createChecksumBuffer(xHubSignature){
    const [alg, sig] = xHubSignature.split('=')
    return Buffer.from(sig, 'utf8')
  }

  _checkDigestChecksumMatch(digestBuffer, checksumBuffer)  {
    if (checksumBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(digestBuffer, checksumBuffer)) {
      this._throwInvalidParamError("x-hub-signature")
    }
  }


  async checkSignature(headers, body){
    await this._checkRequiredFields(this._headersRequiredFields, headers)
    await this._checkBodyExists(body)
    const digest = this._createDigest(body)
    const digestBuffer = this._createDigestBuffer(this._createDigest(body))
    const checksumBuffer = this._createChecksumBuffer(headers['x-hub-signature'])
    this._checkDigestChecksumMatch(digestBuffer, checksumBuffer)
  }
 
}

module.exports = WebhookService
