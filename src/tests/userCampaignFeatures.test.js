const UserCampaignController = require("../server/controllers/userCampaign/UserCampaignController")
const userCampaignController = new UserCampaignController()
const { User, Campaign } = require('../server/models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require("../server/helpers/Errors")
const ModelsExpected = require('./ModelsExpected')
const Mocks = require('./Mocks')
const modelsExpected = new ModelsExpected()
const mocks = new Mocks()

beforeAll(async () => {
  try{
    await databaseSetup()
  }catch(err){
    console.log(err.toString())
  }
})

describe("USERCAMPAIGN tests", () => {
  let userid = ""
  let campaignid = ""
  beforeAll(async () => {
    try{
      const user = await User.create(mocks.mockUser())
      userid = user.id
      const campaign = await Campaign.create(mocks.mockCampaign())
      campaignid = campaign.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await User.destroy({where: {}})
      await Campaign.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("ADD User Campaign tests", () => {
    const requiredFields = ["userid", "campaignid"]  
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          campaignid: campaignid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userCampaignController.add(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test("Should return 400 if invalid userid has been send", async () => {
      const parameters = {
        userid: "invaliduserid",
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.add(req, res)
      const { error } = invalidParamError("userid")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid campaign has been send", async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalidcampaignID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.add(req, res)
      const { error } = invalidParamError("campaignid")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("Should return 200 if item was created", async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)     
      await userCampaignController.add(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userCampaignModel()))
    })

    test("Should return 400 if user already exists in campaign", async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)     
      await userCampaignController.add(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith("User already exists in this campaign")
    })
  })

  describe("LIST User Campaign tests", () => {
    test("Should return 400 if no campaignid has been provided", async () => {
      const parameters = {
        campaignid: campaignid
      }
      delete parameters.campaignid
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)      
      await userCampaignController.list(req, res)
      const { error } = missingParamError('campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if valid campaignid has been provided", async () => {
      const parameters = {
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)      
      await userCampaignController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.userCampaignModel())]))
    })
  })

  describe("DELETE User Campaign tests", () => {
    const requiredFields = ["userid", "campaignid"]  
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          campaignid: campaignid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userCampaignController.remove(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test("Should return 200 if invalid userid has been send", async () => {
      const parameters = {
        userid: "invaliduserid",
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })
    test("Should return 200 with 0 in body if invalid campaign has been send", async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalidcampaignID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })

    test("Should return 200 valid campaignid and userid has been provided", async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })


  })
})