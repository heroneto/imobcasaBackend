const { TokensController } = require('../controllers')
const tokensController = new TokensController()
const { invalidParamError, missingParamError } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected
const databaseSetup = require('../database')
const { Token } = require('../models')

describe("TOKEN Controller Tests", () => {
  describe("SET TOKEN Tests", () => {


    beforeAll(async () => {
      await databaseSetup()
    })

    afterAll(async () => {
      await Token.destroy({})      
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
  })
})