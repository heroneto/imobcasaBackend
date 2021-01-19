const { TokensController } = require('../controllers')
const tokensController = new TokensController()
const { invalidParamError, missingParamError, conflictError } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected
const databaseSetup = require('../database')
const { Token } = require('../models')
const noContentError = require('../helpers/Errors/no-content-error')



async function creteMockedToken(){
  const tokenData = {
    fb_marketing_token: mocks.mockFBMarketingToken()
  }
  
  return await Token.create(tokenData)
}

describe("TOKEN Controller Tests", () => {
  describe("SET TOKEN Tests", () => {

    beforeAll(async () => {
      await databaseSetup()
      await Token.destroy({where: {}})
    })

    afterAll(async () => {
      await Token.destroy({where: {}})
    })

    test("Should return 400 if no token field has been provided", async() => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await tokensController.setToken(req, res)
      const { error } = missingParamError('accessToken')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid token has been provided", async() => {
      const res = mocks.mockRes()
      const body = {
        accessToken: "INVALIDACCESSTOKEN"
      }
      const req = mocks.mockReq(body)
      await tokensController.setToken(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })
    test("Should return 200 if valid Token has been provided", async () => {
      const res = mocks.mockRes()
      const body = {
        accessToken: mocks.mockFBMarketingToken()
      }
      const req = mocks.mockReq(body)
      await tokensController.setToken(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.tokenExpected()))
    })
    test("Should return 400 if token already be set", async() => {
      const res = mocks.mockRes()
      const body = {
        accessToken: mocks.mockFBMarketingToken()
      }
      const req = mocks.mockReq(body)
      const { error } = conflictError("token already be set, please update existing token")
      await tokensController.setToken(req, res)
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
  })

  describe("GET TOKEN Tests", () => {
    test("Should return 204 if token has not be setted", async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await tokensController.getTokens(req, res)
      const { error } = noContentError("accessToken")
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if token is created", async () => {
      await creteMockedToken()
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await tokensController.getTokens(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.tokenExpected())]))
    })
  })
  
  describe("UPDATE TOKEN Tests", () => {
    test(`Should return 400 if no tokenId has been provided`, async () => {      
      const res = mocks.mockRes()
      const req = mocks.mockReq({})
      await tokensController.updateToken(req, res)
      const { error } = missingParamError("tokenId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid tokenId has been provided`, async () => {      
      const res = mocks.mockRes()
      const body = {
        tokenId: "Invalid token id"
      }
      const req = mocks.mockReq(body)
      await tokensController.updateToken(req, res)
      const { error } = invalidParamError("tokenId")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    
  })
})