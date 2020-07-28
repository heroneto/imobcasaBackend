const {getLead, createLead, updateLead, deleteLead} = require('./leadController')
const { invalidParamError, missingParamError, missingBodyContent } = require('../config/').errors
const Leads = require('../../models').lead
const databaseSetup = require('../../../database')

const mockFakeLead = () => {
  const fakeLead = {
    name: "validLead",
    phone: "999123491234",
    source: "validSource",
  }
  return fakeLead
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

describe('LEAD CONTROLLER: tests', () => {
  let leadId = ''
  beforeAll(async ()=>{
    try{
      await databaseSetup()
      const fakeLead = mockFakeLead()
      const Lead = await Leads.create(fakeLead)
      leadId = Lead.id
    }catch(err){
      console.log(err.toString())
    }
  }),
  afterAll(async () => {
    try{
      const fakeLead = mockFakeLead()
      await Leads.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })
  describe('GET LEAD', () => {
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
      const req = mockRequest({}, {id:leadId})
      await getLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith(expect.objectContaining({
        name: expect.any(String),
        phone: expect.any(String),
        source: expect.any(String)
      }))
    })
  })
  describe('POST LEAD', () => {
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
    it('Should return 200 if existing lead has been updated', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead()
      fakeLead.name = 'updateLeadName'
      fakeLead.statusId = 3
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({created: false, lead: expect.any(Object)}))
    })
  })
  describe('PUT LEAD', () => {
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
      fakeLead.id = leadId
      fakeLead.name = 'updatedName'
      fakeLead.phone = 'updatedPhone'
      fakeLead.source = 'updatedSource'
      const req = mockRequest(fakeLead, '')
      await updateLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith(expect.objectContaining(fakeLead))
    })
  })
  describe('DELETE LEAD', () => {
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
      const req = mockRequest('', {id: leadId})
      const res = mockResponse()
      await deleteLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})