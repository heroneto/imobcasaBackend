const { Token } = require('../../models')


class TokenRepository {

  async setToken(fields){
    return await Token.create(fields)
  }
  
  async getTokens(){
    return await Token.findAll()
  }

  async updateToken(token, value){
    token.fb_marketing_token = value
    return await token.save()
  }

  async getOne(tokenId){
    return await Token.findOne({
      where: {
        id: tokenId
      }
    })
  }

  async removeToken(tokenId){
    return await Token.destroy({
      where: {
        id: tokenId
      }
    })
  }

}


module.exports = TokenRepository