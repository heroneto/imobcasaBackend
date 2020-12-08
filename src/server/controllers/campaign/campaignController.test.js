const CampaignController = require('./CampaignController')
const campaignController = new CampaignController()
const CampaignModel = require('../../models').Campaign
const databaseSetup = require('../../../database')
const { missingParamError, invalidParamError } = require("../../helpers/Errors")


const mockFakeCampaign = () => {
  const fakeCampaign = {
    name: "fakeCampaignName",
    active: true,
    fbCreatedDate: new Date(),
    fbCampaignId: "Fake FB Campaign ID",
    fbAdAccountId: "Fake FB AD Account ID"
  }
  return fakeCampaign
}


const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res) 
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

const mockRequest = (body = {}, query = {}, params = {}) => {
  const request = {
    body,
    query,
    params
  }
  return request
}

const getCampaignModelExpected = () => {
  return {
    id: expect.any(String),
    name: expect.any(String),
    active: expect.any(Boolean),
    fbCreatedDate: expect.any(Date),
    fbCampaignId: expect.any(String),
    fbAdAccountId: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt:expect.any(Date)
  }
}

beforeAll(async () => {
  try{
    await databaseSetup()
  }catch(err){
    console.log(err.toString())
  }
})

describe('CAMPAIGN CONTROLLER: tests', () => {
  let campaignId = ""
  beforeAll(async () => {
    try{
      const fakeCampaign = mockFakeCampaign()
      const campaign = await CampaignModel.create(fakeCampaign)
      campaignId = campaign.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await CampaignModel.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("POST Campaign Tests", () => {
    const postRequiredFields = ["name", "active", "fbCreatedDate", "fbCampaignId", "fbAdAccountId"]
    for(const field of postRequiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const fakeCampaign = mockFakeCampaign()
        delete fakeCampaign[`${field}`]
        const req = mockRequest(fakeCampaign, {}, {})
        const res = mockResponse()
        await campaignController.createCampaign(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })      
    }
    test('Should return 201 if campaign was created', async () => {
      const fakeCampaign = mockFakeCampaign()
      const req = mockRequest(fakeCampaign, {}, {})
      const res = mockResponse()
      await campaignController.createCampaign(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getCampaignModelExpected()))
    })
  })
  describe("GET LIST Campaings tests", () => {
    test("Should return 200", async () => {
      const req = mockRequest({}, {}, {})
      const res = mockResponse()
      await campaignController.getCampaigns(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(getCampaignModelExpected())]))
    })
  })
  describe("GET ONE Campaign tests", () => {
    test("Should return 400 if invalid id has been send", async () => {
      const req = mockRequest({}, {}, {id: "invalid id"})
      const res = mockResponse()
      await campaignController.getOne(req, res)
      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async () => {
      const req = mockRequest({}, {}, {id: campaignId})
      const res = mockResponse()
      await campaignController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getCampaignModelExpected()))
    })
  })
  describe("ACTIVATE Campaign Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mockRequest({}, {}, {id: "invalid id"})
      const res = mockResponse()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mockRequest({}, {}, {})
      const res = mockResponse()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mockRequest({}, {}, {id: campaignId})
      const res = mockResponse()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
  describe("INACTIVATE Campaign Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mockRequest({}, {}, {id: "invalid id"})
      const res = mockResponse()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mockRequest({}, {}, {})
      const res = mockResponse()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mockRequest({}, {}, {id: campaignId})
      const res = mockResponse()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
})