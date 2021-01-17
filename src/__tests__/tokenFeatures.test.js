const { TokensController } = require('../controllers')
const tokensController = new TokensController()
const { invalidParamError, missingParamError } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected



describe("TOKEN Controller Tests", () => {
  describe("SET TOKEN Tests", () => {
    test("Should return 400 if no token field has been provided", async() => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await tokensController.setToken(req, res)
      const { error } = missingParamError('accessToken')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
  })
})