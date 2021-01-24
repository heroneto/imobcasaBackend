const Service = require('../Service')
const {
  UserFormRepository,
  FormRepository,
  UserRepository
} = require('../../repositories')


class UserFormService extends Service{
  _requiredFields = ["userid", "formid"]  
  _listRequiredFields = ["formid"]
  _enableRequiredFields = ["userid", "formid"]  
  _disableRequiredFields = ["userid", "formid"]
  _updateRequiredFields = ["userid", "formid", "score", "enabled", "lastLeadReceivedTime"]

  constructor(){
    super()
    this._userFormRepository = new UserFormRepository()
    this._userRespository = new UserRepository()
    this._formRepository = new FormRepository()
  }

  
  _checkUserExistsInForm(entity){
    if(entity){
      this._throwException("User already exists in this form", 400)
    }
  }

  async add(fields){
    await this._checkRequiredFields(this._requiredFields, fields)

    const user = await this._userRespository.getOne({
      id: fields.userid
    })
    await this._checkEntityExsits(user, "userid")

    const form = await this._formRepository.getOne({
      id: fields.formid
    })
    await this._checkEntityExsits(form, "formid")
    
    const userform = await this._userFormRepository.getOne(fields)
    await this._checkUserExistsInForm(userform)
    
    return await this._userFormRepository.add(fields)
  }

  async remove(fields){    
    await this._checkRequiredFields(this._requiredFields, fields)
    const { userid, formid } = fields
    return await this._userFormRepository.remove({ userid, formid })
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    return await this._userFormRepository.list(fields)
  }

  async enable(fields){
    await this._checkRequiredFields(this._enableRequiredFields, fields)
    const { userid, formid } = fields
    const userForm = await this._userFormRepository.getOne({
      userid,
      formid
    })
    await this._checkEntityExsits(userForm, 'userid or formid')
    return await this._userFormRepository.enable(userForm)

  }

  async disable(fields){
    await this._checkRequiredFields(this._disableRequiredFields, fields)
    const { userid, formid } = fields
    const userForm = await this._userFormRepository.getOne({
      userid,
      formid
    })
    await this._checkEntityExsits(userForm, 'userid or formid')
    return await this._userFormRepository.disable(userForm)
  }

  async update(fields){
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const { userid, formid, lastLeadReceivedTime, score, enabled } = fields
    const userForm = await this._userFormRepository.getOne({
      userid,
      formid
    })
    await this._checkEntityExsits(userForm, 'userid or formid')

    return await this._userFormRepository.update(userForm, {
      lastLeadReceivedTime,
      score,
      enabled
    })
  }

}

module.exports = UserFormService