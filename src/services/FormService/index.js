const {FormRepository} = require('../../repositories')
const Service = require("../Service")

class FormService extends Service{
  _createRequiredFields = ["name", "active", "fbCreatedDate", "fbFormId"]
  _getOneRequiredFields = ["id"]
  _changeStateRequiredFields = ["id"]
  constructor(){
    super()
    this._formRepository = new FormRepository()
  }

  async create(fields){
    await this._checkRequiredFields(this._createRequiredFields, fields)
    return await this._formRepository.create(fields)
  }

  async list(){
    return await this._formRepository.list()
  }

  async getOne(fields){
    await this._checkRequiredFields(this._getOneRequiredFields, fields)
    const campaign = await this._formRepository.getOne(fields)
    this._checkEntityExsits(campaign)
    return campaign
  }

  async inactivate(fields){
    await this._checkRequiredFields(this._changeStateRequiredFields, fields)
    return await this._formRepository.inactivate(fields)
  }
  async activate(fields){
    await this._checkRequiredFields(this._changeStateRequiredFields, fields)
    return await this._formRepository.activate(fields)
  }
  
}

module.exports = FormService