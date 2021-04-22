const Service = require('../Service')
const {
  LeadRepository,
  UserFormRepository,
  UserRepository,
  LeadStatusRepository,
  LeadSourceRepository,
  FormRepository,
} = require('../../repositories')


class LeadService extends Service{
  _getOneRequiredFields = ["id", "reqUserId", "admin"]
  _createRequiredFields =  ["name", "phone", "sourceid", "formid", "userid", "active", "statusid", "negociationStartedAt", "reqUserId", "admin"]
  _listRequiredFields = ["reqUserId", "admin", "skip", "limit", "statusId"]
  _updateRequiredFields = ["id", "name", "phone", "sourceid", "formid", "userid", "active", "statusid", "negociationStartedAt", "reqUserId", "admin"]
  _deleteRequiredFields = ["id"]
  _searchRequiredFields = ["value", "reqUserId", "admin"]

  constructor(){
    super()
    this._leadRepository = new LeadRepository()
    this._userFormRepository = new UserFormRepository()
    this._userRepository = new UserRepository()
    this._leadStatusRepository = new LeadStatusRepository()
    this._formRepository = new FormRepository
    this._leadSourceRepository = new LeadSourceRepository()
  }


  _filterMyLeads(leads, fields){
    const filteredLeads = leads.filter(lead => {
      if(lead.userid === fields.reqUserId){
        return lead
      }
    })
    return filteredLeads
  }

  async getOne(fields){
    await this._checkRequiredFields(this._getOneRequiredFields, fields)
    const lead = await this._leadRepository.getOne(fields)
    await this._checkEntityExsits(lead)
    if(!fields.admin && lead.userid !== fields.reqUserId){
      await this._throwForbidenError()
    }
    return lead
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    const { admin, skip, limit, statusId } = fields
    const leads = await this._leadRepository.list({
      skip,
      limit,
      statusId
    })    
    if(!admin){
      return this._filterMyLeads(leads, fields)  
    }
    return leads
    
  }

  async create(fields){
    await this._checkRequiredFields(this._createRequiredFields, fields)
    const {name, phone, sourceid, formid, userid, active, statusid, negociationStartedAt, reqUserId, admin } = fields
    
    if(!admin && userid !== reqUserId){
      await this._throwForbidenError()
    }
       
    const user = await this._userRepository.getOne({id: userid})
    await this._checkEntityExsits(user, "userid")

    const leadStatus = await this._leadStatusRepository.getOne({id: statusid})
    await this._checkEntityExsits(leadStatus, "statusid")

    const leadSource = await this._leadSourceRepository.getOne({id: sourceid})
    await this._checkEntityExsits(leadSource, "sourceid")

    const form = await this._formRepository.getOne({id: formid})
    await this._checkEntityExsits(form, "formid")
  
    const leadFinded = await this._leadRepository.findByPhone(phone)
    if(leadFinded){
      await this._throwConflictError("phone")
    }
    
    const userform = await this._userFormRepository.getOne({
      formid, 
      userid, 
    })
    await this._checkEntityExsits(userform, "User does not exists in form")

    return await this._leadRepository.create(fields)
  }

  async update(fields){
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const lead = await this._leadRepository.getOne(fields)
    await this._checkEntityExsits(lead)
    if(!fields.admin && lead.userid !== fields.reqUserId){
      await this._throwForbidenError()
    }
    const leadFinded = await this._leadRepository.findByPhone(fields.phone)
    if(leadFinded.id !== fields.id){
      await this._throwConflictError("phone")
    }    
    return await this._leadRepository.update(lead, fields)
  }

  async delete(fields){
    await this._checkRequiredFields(this._deleteRequiredFields, fields)
    const lead = await this._leadRepository.getOne(fields)
    await this._checkEntityExsits(lead)
    if(!fields.admin && lead.userid !== fields.reqUserId){
      await this._throwForbidenError()
    }    
    return await this._leadRepository.delete(fields)
  }

  async search(fields){
    await this._checkRequiredFields(this._searchRequiredFields, fields)
    const leads = await this._leadRepository.search(fields)
    if(!fields.admin){
      return this._filterMyLeads(leads, fields)
    }
    return leads    
  }

  async listStatus(){
    return await this._leadStatusRepository.list()
  }

}

module.exports = LeadService
