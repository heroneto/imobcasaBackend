const User = require('../models').users
const {forbiden, invalidRequest, unauthorized, internalError, noContent} = require('../helpers').protocols
const {invalidParamError, missingParamError, serverError, noResultsError} = require('../helpers').errors


class UserService {
  requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  
  _checkRequiredFields(){
    for(const field of this.requiredFields){
      if(!this.body[`${field}`]){          
        const {error} = missingParamError(field)
        const {statusCode, body} = invalidRequest(error)
        // return res.status(statusCode).send(body)
        throw new Error(JSON.stringify({statusCode, body}))
      }
    }
  }

  async createUser(body){    
    this.body = body
    await this._checkRequiredFields()
    const user = await User.create(this.body) 
    return user
  }


}

module.exports = UserService