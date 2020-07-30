const {getLead, createLead, updateLead, deleteLead, getAllLeads, searchLeads} = require('./leadController')
const { invalidParamError, missingParamError, missingBodyContent } = require('../config/').errors
const User = require('../../models').users
const Leads = require('../../models').lead
const LeadStatus = require('../../models').leadstatus
const databaseSetup = require('../../../database')

const mockFakeLead = (userid, statusid) => {
  const fakeLead = {
    name: "validLead",
    phone: "999123491234",
    source: "validSource",
    userid,
    statusid
  }
  return fakeLead
}

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin: true,
    active: true,
    lastLeadReceivedTime: "123456"
  }
  return fakeUser
}

const mockLeadStatus = () => {
  return {
    name: 'To do',
    description: 'Represents an item that is in the queue for execution'
  }
}

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const mockRequest = (body, query) => {
  const request = {}
  request.body = body
  request.query = query
  return request
}


const getLeadModelExpected = () => {
  return {
    name: expect.any(String),
    phone: expect.any(String),
    source: expect.any(String),
    userid: expect.any(Number),
    statusid: expect.any(Number),
    id: expect.any(Number),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  }
}

describe('LEAD CONTROLLER: tests', () => {
  const ids = {}
  beforeAll(async ()=>{
    try{
      await databaseSetup()
      const fakeUser = mockFakeUser()
      const user = await User.create(fakeUser)
      ids.userid = user.id
      const fakeLeadStatus = mockLeadStatus()
      const leadStatus = await LeadStatus.create(fakeLeadStatus)
      ids.leadstausid = leadStatus.id
      const fakeLead = mockFakeLead(user.id, leadStatus.id)
      const Lead = await Leads.create(fakeLead)
      ids.leadid = Lead.id
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
      const req = mockRequest({}, {})
      await getLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.send).toBeCalledWith(error)
    })
    it('GET: Should return 400 is invalid id has been send', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {id: "InvalidId"})
      await getLead(req, res)
      expect(res.status).toBeCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.send).toBeCalledWith(error)
    })
    it('GET: Should return 200 if lead has been found', async () => {
      const res = mockResponse()
      const req = mockRequest({}, {id:ids.leadid})
      await getLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith(expect.objectContaining({
        name: expect.any(String),
        phone: expect.any(String),
        source: expect.any(String)
      }))
    })
  })
  describe('POST Leads', () => {
    const requiredFields = ['name', 'phone', 'source']
    for(const field of requiredFields){
      it(`Should return 400 if no ${field} has been send`, async () => {
        const res = mockResponse()
        const fakeLead = mockFakeLead()
        delete fakeLead[`${field}`]
        const req = mockRequest(fakeLead)
        await createLead(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const {error} = missingParamError(field)
        expect(res.send).toHaveBeenCalledWith(error)
      })
    }
    it('Should return 200 if existing lead already exists', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead()
      fakeLead.name = 'updateLeadName'
      fakeLead.statusId = 3
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({created: false, lead: expect.any(Object)}))
    })
    it('Should return 200 if lead was created', async() => {
      const res = mockResponse()
      const fakeLead = mockFakeLead(ids.userid, ids.leadstausid)
      fakeLead.phone = "9999999999"
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith(expect.objectContaining(getLeadModelExpected()))
    })
  })
  describe('PUT Leads', () => {
    it('PUT: Should return 400 if no body has been send', async () => {
      const res = mockResponse()
      const req = mockRequest()
      await updateLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingBodyContent()
      expect(res.send).toBeCalledWith(error)
    })
    it('PUT: Should return 400 if no id has been send', async () => {
      const res = mockResponse()
      const fakeLead  = mockFakeLead()
      const req = mockRequest(fakeLead, '')
      await updateLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.send).toBeCalledWith(error)
    }),
    it('PUT: Should return 400 if invalid id has been send', async () => {
      const res = mockResponse()
      const fakeLead  = mockFakeLead()
      fakeLead.id = 'FakeId'
      const req = mockRequest(fakeLead, '')
      await updateLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.send).toBeCalledWith(error)
    })
    it('PUT: Should return 200 updated', async () => {
      const res = mockResponse()
      const fakeLead  = mockFakeLead()
      fakeLead.id = ids.leadid
      fakeLead.name = 'updatedName'
      fakeLead.phone = 'updatedPhone'
      fakeLead.source = 'updatedSource'
      const req = mockRequest(fakeLead, '')
      await updateLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith(expect.objectContaining(getLeadModelExpected()))
    })
  })
  describe('DELETE Leads', () => {
    it('Should return 400 if no ID has been send', async () => {
      const req = mockRequest('', '')
      const res = mockResponse()
      await deleteLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('id')
      expect(res.send).toBeCalledWith(error)
    }),
    it('Should return 400 if invalid ID has been send', async () => {
      const req = mockRequest('', {id: 9999})
      const res = mockResponse()
      await deleteLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = invalidParamError('id')
      expect(res.send).toBeCalledWith(error)
    }),
    it('Should return 200', async () => {
      const req = mockRequest('', {id: ids.leadid})
      const res = mockResponse()
      await deleteLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
  describe('GETALL Leads', () => {
    test('Should return 200 with all leads', async () => {
      const req = mockRequest({}, {})
      const res = mockResponse()
      await getAllLeads(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({leads: expect.any(Array)}))
    })
  })
  describe('SEARCH leads', () => {
    const ids = {}
    const lead = {}
    beforeAll(async ()=>{
      try{
        await databaseSetup()
        const fakeUser = mockFakeUser()
        const user = await User.create(fakeUser)
        ids.userid = user.id
        const fakeLeadStatus = mockLeadStatus()
        const leadStatus = await LeadStatus.create(fakeLeadStatus)
        ids.leadstausid = leadStatus.id
        const fakeLead = mockFakeLead(user.id, leadStatus.id)
        const leadCreated = await Leads.create(fakeLead)
        ids.leadid = leadCreated.id
        lead.phone = leadCreated.phone
        lead.name = leadCreated.name
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
    test(`Should return 400 if no search paramters has been send`, async () => {
      const req = mockRequest({}, {})
      const res = mockResponse()
      await searchLeads(req,res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('userid, phone and name')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test('Should return 200 with leads finded if userid has been send', async () => {
      const req = mockRequest({userid: ids.userid}, {})
      const res = mockResponse()
      await searchLeads(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith([expect.any(Object)])
    })
    test('Should return 200 with leads finded if phone lead has been send', async () => {
      const req = mockRequest({phone: lead.phone}, {})
      const res = mockResponse()
      await searchLeads(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith([expect.any(Object)])
    })
    test('Should return 200 with leads finded if name lead has been send', async () => {
      const req = mockRequest({name: lead.name}, {})
      const res = mockResponse()
      await searchLeads(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Object)]))
    })
  })
})