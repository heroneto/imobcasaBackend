const CampaignController = require('../controllers/campaign/CampaignController')
const campaignController = new CampaignController()
const {Campaign} = require('../models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require("../helpers/Errors")
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

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
      const campaign = await Campaign.create(mocks.mockCampaign())
      campaignId = campaign.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await Campaign.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("POST Campaign Tests", () => {
    const postRequiredFields = ["name", "active", "fbCreatedDate", "fbCampaignId", "fbAdAccountId"]
    for(const field of postRequiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const fakeCampaign = mocks.mockCampaign()
        delete fakeCampaign[`${field}`]
        const req = mocks.mockReq(fakeCampaign, {}, {})
        const res = mocks.mockRes()
        await campaignController.createCampaign(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })      
    }
    test('Should return 201 if campaign was created', async () => {
      const fakeCampaign = mocks.mockCampaign()
      const req = mocks.mockReq(fakeCampaign, {}, {})
      const res = mocks.mockRes()
      await campaignController.createCampaign(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.campaignModel()))
    })
  })
  describe("GET LIST Campaings tests", () => {
    test("Should return 200", async () => {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await campaignController.getCampaigns(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.campaignModel())]))
    })
  })
  describe("GET ONE Campaign tests", () => {
    test("Should return 400 if invalid id has been send", async () => {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await campaignController.getOne(req, res)
      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async () => {
      const req = mocks.mockReq({}, {}, {id: campaignId})
      const res = mocks.mockRes()
      await campaignController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.campaignModel()))
    })
  })
  describe("ACTIVATE Campaign Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: campaignId})
      const res = mocks.mockRes()
      await campaignController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
  describe("INACTIVATE Campaign Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: campaignId})
      const res = mocks.mockRes()
      await campaignController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
})