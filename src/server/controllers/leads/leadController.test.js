const LeadController = require('./LeadController')
const leadController = new LeadController()
const { invalidParamError, missingParamError, missingBodyContent, forbidenError, conflictError  } = require('../../helpers').errors
const User = require('../../models').users
const Leads = require('../../models').lead
const LeadStatus = require('../../models').leadstatus
const LeadSource = require('../../models').leadSource

const databaseSetup = require('../../../database')
const mockFakeLead = (userid, statusid, sourceId) => {
  const fakeLead = {
    name: "Fake Lead", 
    phone: "0000000000", 
    sourceid: sourceId, 
    campaignid: null,
    userid: userid,
    active: true,
    statusid: statusid,
    negociationStartedAt: new Date()
  }
  return fakeLead
}

const mockFakeAdminUser = () => {
  const fakeUser = {
    username: "admin",
    admin: true,
    fullName: "limitedUser",
    email: "no@mail.com.br",
    password: "fakePass",
    active: true
  }
  return fakeUser
}

const mockFakeLimitedUser = () => {
  const fakeUser = {
    username: "limitedUser2",
    admin: false,
    fullName: "limitedUser",
    email: "no@mail.com.br",
    password: "fakePass",
    active: true
  }
  return fakeUser
}

const mockLeadStatus = () => {
  return {
    name: 'To do',
    description: 'Represents an item that is in the queue for execution'
  }
}

const mockLeadSource = () => {
  return {
    name: "Manual",
    active: true,
  }
}

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const mockRequest = (body = {}, query = {}, params = {}, locals = {}) => {
  const request = {}
  request.body = body
  request.query = query
  request.params = params
  request.locals = locals
  return request
}


const getLeadModelExpected = () => {
  return {
    id: expect.any(String),
    name: expect.any(String),
    phone: expect.any(String),
    sourceid: expect.any(String),
    campaignid: null,
    userid: expect.any(String),
    active: expect.any(Boolean),
    statusid: expect.any(String),
    negociationStartedAt: expect.any(Date),
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date)
  }
}

describe('LEAD CONTROLLER: tests', () => {
  let limitedUser = {}
  let adminUser = {}
  let lead = {}
  let leadStatus = {}
  let leadSource = {}

  beforeAll(async ()=>{
    try{
      await databaseSetup()
      adminUser = await User.create(mockFakeAdminUser())
      limitedUser = await User.create(mockFakeLimitedUser())
      leadStatus = await LeadStatus.create(mockLeadStatus())
      leadSource = await LeadSource.create(mockLeadSource())
      lead = await Leads.create(mockFakeLead(adminUser.id, leadStatus.id, leadSource.id))
    }catch(err){
      console.log(err.toString())
    }
  }),
  afterAll(async () => {
    try{
      await Leads.destroy({where: {}})
      await LeadStatus.destroy({where: {}})
      await User.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })
  describe('GET Leads', () => {
    it('GET: Should return 400 if no id has been send', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {}, {}, {})
      await leadController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 if no reqUserId has been send', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {}, {id: lead.id}, {})
      await leadController.getOne(req, res)
      expect(res.status).toBeCalledWith(400)
      const { error } = missingParamError('reqUserId')
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 if invalid id has been send', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {}, {id: "InvalidId"}, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.getOne(req, res)
      expect(res.status).toBeCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 with forbiden message if reqUserId does not match with userid in lead properties', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {}, {id: lead.id}, {reqUserId: limitedUser.id, admin: limitedUser.admin})
      await leadController.getOne(req, res)
      const { error } = forbidenError()
      expect(res.status).toBeCalledWith(403)
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 200 if lead has been found', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {}, {id: lead.id}, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(expect.objectContaining(getLeadModelExpected()))
    })
  })
  describe('POST Leads', () => {
    const requiredFields = ["name", "phone", "sourceid", "campaignid", "userid", "active", "statusid", "negociationStartedAt"]
    for(const field of requiredFields){
      it(`POST: Should return 400 if no ${field} has been send`, async () => {
        const res = mockResponse()
        const fakeLead = mockFakeLead()
        delete fakeLead[`${field}`]
        const req = mockRequest(fakeLead, {}, {id: lead.id}, {reqUserId: adminUser.id, admin: adminUser.admin})
        await leadController.create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const {error} = missingParamError(field)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    it(`POST: Should return 400 if no admin has been send`, async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {reqUserId: adminUser.id})
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`POST: Should return 400 if no reqUserId has been send`, async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {admin: adminUser.admin})
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('reqUserId')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 409 if existing lead already exists', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.create(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 200 if lead has been created', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.name = "newName"
      fakeLead.phone = "newPhoneNumber"
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getLeadModelExpected()))
    })
  })
  describe('PUT Leads', () => {
    let leadToUpdate
    beforeAll(async ()=>{
      try{
        const leadMock = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
        leadMock.phone = "11111111111"
        leadToUpdate = await Leads.create(leadMock)
      }catch(err){
        console.log(err.toString())
      }
    }),
    afterAll(async () => {
      try{
        await Leads.destroy({where: {
          id: leadToUpdate.id
        }})
      }catch(err){
        console.log(err)
      }
    })
    const requiredFields = ["id", "name", "phone", "sourceid", "campaignid", "userid", "active", "statusid", "negociationStartedAt"]
    for(const field of requiredFields){
      it(`PUT: Should return 400 if no ${field} has been send`, async () => {
        const res = mockResponse()
        const fakeLead = mockFakeLead()
        fakeLead.id = leadToUpdate.id
        delete fakeLead[`${field}`]
        const req = mockRequest(fakeLead, null, null, {reqUserId: adminUser.id, admin: adminUser.admin})
        await leadController.update(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const {error} = missingParamError(field)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    it(`PUT: Should return 400 if no admin has been send`, async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {reqUserId: adminUser.id})
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`PUT: Should return 400 if no reqUserId has been send`, async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mockRequest(fakeLead, {}, {id: lead.id}, {admin: adminUser.admin})
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('reqUserId')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('PUT: Should return 400 if invalid id has been send', async () => {
      const res = mockResponse()
      const fakeLead  = mockFakeLead()
      fakeLead.id = 'FakeId'
      const req = mockRequest(fakeLead, {}, null, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toBeCalledWith(error)
    })
    it('PUT: Should return 409 if phone already used in another lead', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mockRequest(fakeLead, null, null, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.update(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('PUT: Should return 200 updated', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      fakeLead.phone = leadToUpdate.phone
      fakeLead.name = "New Lead Name"
      const req = mockRequest(fakeLead, null, null, {reqUserId: adminUser.id, admin: adminUser.admin})
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...getLeadModelExpected(),
        name: fakeLead.name,
        phone: fakeLead.phone,
        id: fakeLead.id
      }))
    })
    
  })
  // describe('DELETE Leads', () => {
  //   it('Should return 400 if no ID has been send', async () => {
  //     const req = mockRequest('', '')
  //     const res = mockResponse()
  //     await deleteLead(req, res)
  //     expect(res.status).toHaveBeenCalledWith(400)
  //     const {error} = missingParamError('id')
  //     expect(res.send).toBeCalledWith(error)
  //   }),
  //   it('Should return 400 if invalid ID has been send', async () => {
  //     const req = mockRequest('', {id: 9999})
  //     const res = mockResponse()
  //     await deleteLead(req, res)
  //     expect(res.status).toHaveBeenCalledWith(400)
  //     const {error} = invalidParamError('id')
  //     expect(res.send).toBeCalledWith(error)
  //   }),
  //   it('Should return 200', async () => {
  //     const req = mockRequest('', {id: ids.leadid})
  //     const res = mockResponse()
  //     await deleteLead(req, res)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //   })
  // })
  // describe('GETALL Leads', () => {
  //   test('Should return 200 with all leads', async () => {
  //     const req = mockRequest({}, {})
  //     const res = mockResponse()
  //     await getAllLeads(req,res)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //     expect(res.send).toHaveBeenCalledWith(expect.objectContaining({leads: expect.any(Array)}))
  //   })
  // })
  // describe('SEARCH leads', () => {
  //   const ids = {}
  //   const lead = {}
  //   beforeAll(async ()=>{
  //     try{
  //       await databaseSetup()
  //       const fakeUser = mockFakeUser()
  //       const user = await User.create(fakeUser)
  //       ids.userid = user.id
  //       const fakeLeadStatus = mockLeadStatus()
  //       const leadStatus = await LeadStatus.create(fakeLeadStatus)
  //       ids.leadstausid = leadStatus.id
  //       const fakeLead = mockFakeLead(user.id, leadStatus.id)
  //       const leadCreated = await Leads.create(fakeLead)
  //       ids.leadid = leadCreated.id
  //       lead.phone = leadCreated.phone
  //       lead.name = leadCreated.name
  //     }catch(err){
  //       console.log(err.toString())
  //     }
  //   }),
  //   afterAll(async () => {
  //     try{
  //       await Leads.destroy({where: {}})
  //       await LeadStatus.destroy({where: {}})
  //       await User.destroy({where: {}})
  //     }catch(err){
  //       console.log(err)
  //     }
  //   })
  //   test(`Should return 400 if no search paramters has been send`, async () => {
  //     const req = mockRequest({}, {})
  //     const res = mockResponse()
  //     await searchLeads(req,res)
  //     expect(res.status).toHaveBeenCalledWith(400)
  //     const {error} = missingParamError('userid, phone and name')
  //     expect(res.send).toHaveBeenCalledWith(error)
  //   })
  //   test('Should return 200 with leads finded if userid has been send', async () => {
  //     const req = mockRequest({userid: ids.userid}, {})
  //     const res = mockResponse()
  //     await searchLeads(req,res)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //     expect(res.send).toHaveBeenCalledWith([expect.any(Object)])
  //   })
  //   test('Should return 200 with leads finded if phone lead has been send', async () => {
  //     const req = mockRequest({phone: lead.phone}, {})
  //     const res = mockResponse()
  //     await searchLeads(req,res)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //     expect(res.send).toHaveBeenCalledWith([expect.any(Object)])
  //   })
  //   test('Should return 200 with leads finded if name lead has been send', async () => {
  //     const req = mockRequest({name: lead.name}, {})
  //     const res = mockResponse()
  //     await searchLeads(req,res)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //     expect(res.send).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Object)]))
  //   })
  // })
})