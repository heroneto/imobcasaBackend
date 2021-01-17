const { WebhookController } = require('../controllers')
const webhookController = new WebhookController()
const { invalidParamError, missingParamError, missingBodyContent } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const mocks = new Mocks()
const ModelsExpected = require('./helpers/ModelsExpected')
const modelsExpected = new ModelsExpected()


describe("WEBHOOK FEATURES Tests", () => {
  describe("ADD LEAD Tests", () => {
    test("Should return 400 if no entry field has been provided", async () => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      delete body.entry
      const req = mocks.mockReq(body)
      const { error } = missingParamError('entry')
      await webhookController.addLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if entry field has been provided with no values", async () => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      body.entry = []
      const req = mocks.mockReq(body)
      const { error } = invalidParamError('entry')
      await webhookController.addLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if no changes field has been provided", async () => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      delete body.entry[0].changes
      const req = mocks.mockReq(body)
      const { error } = missingParamError('changes')
      await webhookController.addLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if entry field has been provided with no values", async () => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      body.entry[0].changes = []
      const req = mocks.mockReq(body)
      const { error } = invalidParamError('changes')
      await webhookController.addLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("Should return 400 if no changes field has been provided", async () => {
      const res = mocks.mockRes()
      const body = mocks.mockLeadWebhook()
      delete body.entry[0].changes[0].value
      const req = mocks.mockReq(body)
      const { error } = missingParamError('value')
      await webhookController.addLead(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    // const requiredFields = [
    //   "ad_id",
    //   "form_id",
    //   "leadgen_id",
    //   "created_time",
    //   "page_id",
    //   "adgroup_id",
    // ]
    // for (const field of requiredFields) {
    //   test(`Should return 400 if no ${field} has been provided`, async () => {
    //     const res = mocks.mockRes()
    //     const body = mocks.mockLeadWebhook()
    //     delete body[`${field}`]
    //     const req = mocks.mockReq(body)
    //     await webhookController.addLead(req, res)
    //     expect(res.status).toHaveBeenCalledWith(400)
    //   })
    // }
  })
})