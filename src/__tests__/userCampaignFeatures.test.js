const {UserCampaignController} = require("../controllers")
const userCampaignController = new UserCampaignController()
const { User, Campaign, Userscampaigns } = require('../models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require("../helpers/Errors")
const ModelsExpected = require('./helpers/ModelsExpected')
const Mocks = require('./helpers/Mocks')
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
      await Userscampaigns.destroy({where: {}})
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

    test("Should return 400 if userid already exists in campaign", async () => {
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

  describe("ENABLE User Campaign tests", () => {
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
        
        await userCampaignController.enable(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.enable(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalid Campaign ID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.enable(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.enable(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userCampaignModel(),
        enabled: true
      }))
    })
  })

  describe("DISABLE User Campaign tests", () => {
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
        
        await userCampaignController.disable(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.disable(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalid Campaign ID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.disable(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if valid userid and campaignid has been provided`, async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userCampaignController.disable(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userCampaignModel(),
        enabled: false
      }))
    })
  })


  describe("UPDATE User in Campaign tests", () => {
    const requiredParamFields = ["userid", "campaignid"]
    for(const field of requiredParamFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          campaignid: campaignid
        }
        delete parameters[`${field}`]
        const body = {
          score: 50,
          enabled: true,
          lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
        }
        const res = mocks.mockRes()
        const req = mocks.mockReq(body, null, parameters)
        
        await userCampaignController.update(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    const requiredBodyFields = ["score", "enabled", "lastLeadReceivedTime"]
    for(const field of requiredBodyFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          campaignid: campaignid
        }
        const body = {
          score: 50,
          enabled: true,
          lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
        }
        delete body[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(body, null, parameters)
        
        await userCampaignController.update(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        campaignid: campaignid
      }
      const body = {
        score: 50,
        enabled: true,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userCampaignController.update(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalid Campaign ID'
      }
      const body = {
        score: 50,
        enabled: true,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userCampaignController.update(req, res)
      const { error } = invalidParamError('userid or campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if all fields has been provided and user updated`, async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const body = {
        score: 100,
        enabled: false,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userCampaignController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userCampaignModel(),
        ...body,
        lastLeadReceivedTime: expect.any(Date),
      }))
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