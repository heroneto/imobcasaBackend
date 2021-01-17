const { Token } = require('../../models')


class TokenRepository {

  async setToken(fields){
    return await Token.create(fields)
  }
  
  async getTokens(){
    return await Token.findAll()
  }

}


module.exports = TokenRepository