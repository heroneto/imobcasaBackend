const User = require('../models').users
const {forbiden, invalidRequest, unauthorized, internalError, noContent} = require('../helpers').protocols
const {invalidParamError, missingParamError, serverError, noResultsError} = require('../helpers').errors
const { Op } = require("sequelize");

class UserService {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']

  _checkRequiredFields(fieldsToCheck){
    for(const field of fieldsToCheck){
      if(!this.body[`${field}`]){          
        const {error} = missingParamError(field)
        const {statusCode, body} = invalidRequest(error)
        throw new Error(JSON.stringify({statusCode, body}))
      }
    }
  }

  checkUpdateRequiredFields(fieldsToCheck){

  }

  async createUser(body){    
    this.body = body
    await this._checkRequiredFields(this._requiredFields)
    const user = await User.create(this.body) 
    return user
  }

  async findAll(){
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    return users
  }

  async updateUser(body){
    this.body = body
    await this._checkRequiredFields(this._updateRequiredFields)

    const user = await User.findOne({where:{
      id: this.body.id
    }})
    if(!user){
      const {error} = invalidParamError('id')
      const {statusCode, body} = invalidRequest(error)
      throw new Error(JSON.stringify({statusCode, body}))
    }      
    user.fullName = this.body.fullName
    user.username = this.body.username
    user.email = this.body.email
    user.admin = this.body.admin
    await user.save()
    return user
  }

  async deleteUser(body){
    this.body = body
    await this._checkRequiredFields(this._deleteUserRequiredFields)   
    const user = await User.findOne({where:
      {
        id: this.body.id
      }
    })
    if(!user){
      const {error} = invalidParamError('id or username')
      const {statusCode, body} = invalidRequest(error)
      throw new Error(JSON.stringify({statusCode, body}))
    }
    const result = await User.destroy({where:
      {
        id: this.body.id
      }
    })
    return result
  }


}

module.exports = UserService