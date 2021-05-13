const Service = require('../Service')
const {
  LeadRepository,
  UserFormRepository,
  UserRepository,
  LeadStatusRepository,
  LeadSourceRepository,
  FormRepository,
  TaskRepository
} = require('../../repositories')


class LeadService extends Service{
  _getOneRequiredFields = ["id", "reqUserId", "admin"]
  _createRequiredFields =  ["name", "phone", "sourceid", "formid", "userid", "active", "statusid", "negociationStartedAt", "reqUserId", "admin"]
  _listRequiredFields = ["reqUserId", "admin", "skip", "limit"]
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
    this._taskRepository = new TaskRepository()
  }

  async _getOwnerData(userid){
    const { fullName, username } = await this._userRepository.getOne({id: userid})
    return  { fullName, username } 
  }

  async _getFormData(formid){
    const { name } = await this._formRepository.getOne({id: formid}) 
    return { name }
  }

  async _getLeadSource(leadSourceId){
    const { name } = await this._leadSourceRepository.getOne({ id: leadSourceId })
    return { name }
  }

  async _getLeadStatus(statusId){
    const { name } = await this._leadStatusRepository.getOne({ id: statusId })
    return { name }
  }

  async _getLeadTasks(leadId){
    const result = await this._taskRepository.listByLead({ leadid: leadId })
    let tasks = []

    for(const task of result){
      const { fullName, username } = await this._getOwnerData(task.userid)
      tasks.push({
        ...task.toJSON(),
        ownerData: {
          username,
          fullName
        }
      })
    }

    return tasks
  }


  async _normalizeLeadData(leads){
    const normalizedData = []
    for(const lead of leads){
      lead.ownerData =  await this._getOwnerData(lead.userid)
      lead.formData = await this._getFormData(lead.formid)
      normalizedData.push(lead)
    }
    return normalizedData
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

    const ownerData = await this._getOwnerData(lead.userid)
    const formData = await this._getFormData(lead.formid)
    const sourceData = await this._getLeadSource(lead.sourceid)
    const statusData = await this._getLeadStatus(lead.statusid)
    const tasks = await this._getLeadTasks(lead.id)

    if(!fields.admin && lead.userid !== fields.reqUserId){
      await this._throwForbidenError()
    }

    return {
      ...lead.toJSON(),
      ownerData,
      formData,
      sourceData,
      statusData,
      tasks
    }
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    const { admin, skip, limit, statusId } = fields

    if(!statusId){
      const leads = await this._leadRepository.list({
        skip,
        limit,
        statusId
      })    

      if(!admin){
        return this._normalizeLeadData(this._filterMyLeads(leads, fields))
      }
      return this._normalizeLeadData(leads)      
    }
   

    const leads = await this._leadRepository.listByStatus({
      skip,
      limit,
      statusId
    })       
    if(!admin){
      return this._normalizeLeadData(this._filterMyLeads(leads, fields))
    }
    return this._normalizeLeadData(leads)
    
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
    const lead = await this._leadRepository.getOne(fields, false)
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

  async listSource() {
    return await this._leadSourceRepository.list()
  }

}

module.exports = LeadService
