const Service = require('./Service')
const LeadRepository = require('../repositories/LeadRepository')

class LeadService extends Service{
  _getOneRequiredFields = ["id"]
  _createRequiredFields =  ["name", "phone", "sourceid", "campaignid", "userid", "active", "statusid", "negociationStartedAt"]
  _listRequiredFields = ["id"]
  _updateRequiredFields = ["id", "name", "phone", "sourceid", "campaignid", "userid", "active", "statusid"]
  _deleteRequiredFields = ["id"]
  _searchRequiredFields = ["value"]

  constructor(){
    super()
    this._leadRepository = new LeadRepository()
  }

  async getOne(fields){
    await this._checkRequiredFields(this._getOneRequiredFields, fields)
    const lead = await this._leadRepository.getOne(fields)
    await this._checkEntityExsits(lead)
    return lead
  }

  async list(fields){
    return await this._leadRepository.list()
  }

  async create(fields){
    await this._checkRequiredFields(this._createRequiredFields, fields)
    return await this._leadRepository.create(fields)
  }

  async update(fields){
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const lead = await this._leadRepository.getOne(fields)
    await this._checkEntityExsits(lead)
    return await this._leadRepository.update(lead, fields)
  }

  async delete(fields){
    await this._checkRequiredFields(this._deleteRequiredFields, fields)
    return await this._leadRepository.delete(fields)
  }

  async search(fields){
    console.log(fields)
    await this._checkRequiredFields(this._searchRequiredFields, fields)
    return await this._leadRepository.search(fields)
  }

}

module.exports = LeadService
