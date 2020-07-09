const {getLead, createLead} = require('./leadController')
const { invalidParamError, missingParamError } = require('../Errors/')
const {Leads} = require('../models/')
const startDatabase = require('../../setup/database')

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

beforeAll(async () => {
  try{
    startDatabase()
    const fakeLead = mockFakeLead()
    await Leads.create(fakeLead)
  }catch(err){
    console.log(err.toString())
  }
})



describe('LEAD CONTROLLER: tests', () => {
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
    const req = mockRequest({}, {id:1})
    await getLead(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toBeCalledWith(expect.objectContaining({
      name: expect.any(String),
      phone: expect.any(String),
      source: expect.any(String)
    }))
  }),
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
})