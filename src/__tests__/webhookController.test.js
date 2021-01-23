const { WebhookController } = require('../controllers')
const webhookController = new WebhookController()
const { invalidParamError, missingParamError, missingBodyContent } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const mocks = new Mocks()
const ModelsExpected = require('./helpers/ModelsExpected')
const modelsExpected = new ModelsExpected()


describe("WEBHOOK CONTROLLER Tests", () => {
  describe("SUBSCRIVE Tests", () => {
    const subscriveRequiredFields = ['hub.mode', 'hub.verify_token', 'hub.challenge']
    for(const field of subscriveRequiredFields){
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        delete mockedQuery[`${field}`]
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = missingParamError(field)
        await webhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test('Should return 400 if invalid hub.mode has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest('invalidMode')
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = invalidParamError('hub.mode')
        await webhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 400 if invalid hub.verify_token has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        mockedQuery['hub.verify_token'] = 'invalidVerifyToken'
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = invalidParamError('hub.verify_token')
        await webhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 and hub.challenge if valid fields has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        const req = mocks.mockReq(null, mockedQuery)
        await webhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockedQuery['hub.challenge'])
    })
  })
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
    const valueRequiredFields = [
      "form_id",
      "leadgen_id",
      "created_time",
      "page_id"
    ]
    for (const field of valueRequiredFields) {
      test(`Should return 400 if no ${field} has been provided in value field`, async () => {
        const res = mocks.mockRes()
        const body = mocks.mockLeadWebhook()
        delete body.entry[0].changes[0].value[`${field}`]
        const req = mocks.mockReq(body)
        const { error } = missingParamError(field)
        await webhookController.addLead(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
  })
})