const { WebhookMiddleware } = require('../middlewares')
const webhookMiddleware = new WebhookMiddleware()
const { invalidParamError, missingParamError, missingBodyContent } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const mocks = new Mocks()


describe("WEBHOOK Middlware Tests", () => {

  describe("1 - CHECKSIGNATURE Tests", () => {
    test("1 - Should return 400 if no X-Hub-Signature has been provided", async () => {
      const leadgen = mocks.mockLeadWebhook()
      const res = mocks.mockRes()
      const req = mocks.mockReq(leadgen, null, null, null, {})
      const next = mocks.mockNext()
      const { error } = missingParamError('x-hub-signature')
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("2 - Should return 400 if no body has been provided", async() => {
      const res = mocks.mockRes()     
      const header = {
        ['x-hub-signature']: "sha1=ANYSIGNATURE"
      }
      const req = mocks.mockReq(null, null, null, null, header)
      const next = mocks.mockNext()
      const { error } = missingBodyContent()
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("3 - Should return 400 if invalid X-Hub-Signature has been provided", async() => {
      const res = mocks.mockRes()     
      const header = {
        ['x-hub-signature']: "sha1=INVALIDXHUBSIGNATURE"
      }
      const req = mocks.mockReq(mocks.mockLeadWebhook(), null, null, null, header)
      const next = mocks.mockNext()
      const { error } = invalidParamError('x-hub-signature')
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("4 - Should call Next if X-Hub-Signature has been provided", async() => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      const xhubsignature = mocks.mockXHubSignature(body)
      const header = {
        ['x-hub-signature']: xhubsignature
      }
      const req = mocks.mockReq(body, null, null, null, header)
      const next = mocks.mockNext()
      await webhookMiddleware.checkSignature(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(400)
      expect(next).toHaveBeenCalled()
    })
  })
})