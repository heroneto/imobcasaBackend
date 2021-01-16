const { WebhookMiddleware } = require('../middlewares')
const webhookMiddleware = new WebhookMiddleware()
const { invalidParamError, missingParamError, missingBodyContent } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected
const databaseSetup = require('../database')


describe("WEBHOOK Middlware Tests", () => {

  describe("CHECKSIGNATURE Tests", () => {
    test("Should return 400 if no X-Hub-Signature has been provided", async () => {
      const leadgen = mocks.mockLeadWebhook()
      const res = mocks.mockRes()
      const req = mocks.mockReq(leadgen, null, null, null, {})
      const next = mocks.mockNext()
      const { error } = missingParamError('x-hub-signature')
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    
    test("SHould return 400 if invalid X-Hub-Signature has been provided", async() => {
      const res = mocks.mockRes()     
      const header = {
        ['x-hub-signature']: "INVALIDXHUBSIGNATURE"
      }
      const req = mocks.mockReq(mocks.mockLeadWebhook(), null, null, null, header)
      const next = mocks.mockNext()
      const { error } = invalidParamError('x-hub-signature')
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("Should call Next if X-Hub-Signature has been provided", async() => {
      const res = mocks.mockRes()     
      const xhubsignature = mocks.mockXHubSignature(mocks.mockLeadWebhook())
      const header = {
        ['x-hub-signature']: xhubsignature
      }
      const req = mocks.mockReq(mocks.mockLeadWebhook(), null, null, null, header)
      const next = mocks.mockNext()
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(400)
      expect(next).toHaveBeenCalled()
    })
  })
})