const {getLead, createLead, updateLead, deleteLead} = require('./leadController')
const { invalidParamError, missingParamError, missingBodyContent } = require('../Errors/')
const {Leads} = require('../models/')
const {databaseSetup} = require('../setup/')

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
  describe('GET LEAD', () => {
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
        await Leads.destroy({where: {phone: fakeLead.phone}})
      }catch(err){
        console.log(err)
      }
    })
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
    it('GET: Should return 200 if user has been found', async () => {
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
    let phone = ''
    let leadId = ''
    beforeAll(async ()=>{
      const fakeLead = mockFakeLead()
      const Lead = await Leads.create(fakeLead)
      leadId = Lead.id
      phone = Lead.phone
    })
    afterAll(async () => {
      try{
        const fakeLead = mockFakeLead()
        await Leads.destroy({where: {phone: fakeLead.phone}})
      }catch(err){
        console.log(err)
      }
    })
    it('POST: Should return 400 if no name has been send', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead()
      delete fakeLead.name
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('name')
      expect(res.send).toHaveBeenCalledWith(error)
    }),
    it('POST: Should return 400 if no phone has been send', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead()
      delete fakeLead.phone
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('phone')
      expect(res.send).toHaveBeenCalledWith(error)
    }),
    it('POST: Should return 400 if no source has been send', async () => {
      const res = mockResponse()
      const fakeLead = mockFakeLead()
      delete fakeLead.source
      const req = mockRequest(fakeLead)
      await createLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('source')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 200 if existing lead has been updated', async () => {
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
    let leadId = ''
    beforeAll(async ()=>{
      const fakeLead = mockFakeLead()
      const Lead = await Leads.create(fakeLead)
      leadId = Lead.id
    })
    afterAll(async () => {
      try{
        const fakeLead = mockFakeLead()
        await Leads.destroy({where: {phone: fakeLead.phone}})
      }catch(err){
        console.log(err)
      }
    })
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
    let leadId = ''
    beforeAll(async ()=>{
      const fakeLead = mockFakeLead()
      const Lead = await Leads.create(fakeLead)
      leadId = Lead.id
    })
    afterAll(async () => {
      try{
        const fakeLead = mockFakeLead()
        await Leads.destroy({where: {phone: fakeLead.phone}})
      }catch(err){
        console.log(err)
      }
    })
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