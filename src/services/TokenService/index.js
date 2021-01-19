const Service = require('../Service')
const { checkToken } = require('../apis')
const { TokenRepository } = require('../../repositories')

class TokenService extends Service {
  _requiredFields = ["accessToken"]
  _updateTokenRequiredFields = ["tokenId"]

  constructor() {
    super()
    this._tokenRepository = new TokenRepository()
  }

  async setToken(fields) {
    const result = await this._tokenRepository.getTokens()
    if(result.length > 0){
      this._throwConflictError("token already be set, please update existing token")
    }    
    this._checkRequiredFields(this._requiredFields, fields)
    const { accessToken } = fields    
    const {data} = await checkToken(accessToken)      
    const tokenData = {
      fb_marketing_token: data.access_token
    }  
    return await this._tokenRepository.setToken(tokenData)
  }

  async getTokens(){
    const result = await this._tokenRepository.getTokens()
    if(result.length === 0){
      this._throwNoContentError("accessToken")
    }    
    return result
  }

  async updateToken(fields){
    this._checkRequiredFields(this._updateTokenRequiredFields, fields)
    const { tokenId } = fields
    const result = await this._tokenRepository.getOne(tokenId)
    this._checkEntityExsits(result, "tokenId")
    return fields
  }
}

module.exports = TokenService