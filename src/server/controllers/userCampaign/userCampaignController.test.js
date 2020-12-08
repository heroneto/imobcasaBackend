const UserCampaignController = require("./UserCampaignController")
const userCampaignController = new UserCampaignController()
const UserModel = require('../../models').users
const CampaignModel = require('../../models').Campaign
const UsersCampaignsModel = require('../../models').usersCampaigns
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

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin: true,
    active: true,
  }
  return fakeUser
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



const getModelExpected = () => {
  return {
    id: expect.any(String),
    campaignid: expect.any(String),
    userid: expect.any(String),
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

describe("USERCAMPAIGN tests", () => {
  let userid = ""
  let campaignid = ""
  beforeAll(async () => {
    try{
      const fakeUser = mockFakeUser()
      const user = await UserModel.create(fakeUser)
      userid = user.id
  
      const fakeCampaign = mockFakeCampaign()
      const campaign = await CampaignModel.create(fakeCampaign)
      campaignid = campaign.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await UsersCampaignsModel.destroy({where: {}})
      await CampaignModel.destroy({where: {}})
      await UserModel.destroy({where: {}})
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
        const res = mockResponse()
        const req = mockRequest({}, {}, parameters)
        
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
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)
      
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
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)
      
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
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)     
      await userCampaignController.add(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getModelExpected()))
    })

    test("Should return 400 if user already exists in campaign", async () => {
      const parameters = {
        userid: userid,
        campaignid: campaignid
      }
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)     
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
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)      
      await userCampaignController.list(req, res)
      const { error } = missingParamError('campaignid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if valid campaignid has been provided", async () => {
      const parameters = {
        campaignid: campaignid
      }
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)      
      await userCampaignController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(getModelExpected())]))
    })
  })

  describe("DELETE User Campaign tests", () => {
    test("Should return 200 if invalid userid has been send", async () => {
      const parameters = {
        userid: "invaliduserid",
        campaignid: campaignid
      }
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)
      
      await userCampaignController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })
    test("Should return 200 if invalid campaign has been send", async () => {
      const parameters = {
        userid: userid,
        campaignid: 'invalidcampaignID'
      }
      const res = mockResponse()
      const req = mockRequest({}, {}, parameters)
      
      await userCampaignController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })
  })
})