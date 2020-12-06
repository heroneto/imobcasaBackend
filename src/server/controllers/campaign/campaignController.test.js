const CampaignController = require('./CampaignController')
const campaignController = new CampaignController()
const CampaignModel = require('../../models').Campaign
const databaseSetup = require('../../../database')
const { missingParamError } = require("../../helpers/Errors")


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
})