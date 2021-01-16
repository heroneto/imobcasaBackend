const { LeadWebhookController } = require('../controllers')
const leadWebhookController = new LeadWebhookController()
const { invalidParamError, missingParamError } = require('../helpers/Errors')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected
const databaseSetup = require('../database')


describe("LEAD WEBHOOK Controller Tests", () => {



  describe("SUBSCRIVE Tests", () => {
    const subscriveRequiredFields = ['hub.mode', 'hub.verify_token', 'hub.challenge']
    for(const field of subscriveRequiredFields){
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        delete mockedQuery[`${field}`]
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = missingParamError(field)
        await leadWebhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test('Should return 400 if invalid hub.mode has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest('invalidMode')
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = invalidParamError('hub.mode')
        await leadWebhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 400 if invalid hub.verify_token has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        mockedQuery['hub.verify_token'] = 'invalidVerifyToken'
        const req = mocks.mockReq(null, mockedQuery)
        const { error } = invalidParamError('hub.verify_token')
        await leadWebhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 and hub.challenge if valid fields has been provided', async () => {
      const res = mocks.mockRes()
        const mockedQuery = mocks.mockSubscriveRequest()
        const req = mocks.mockReq(null, mockedQuery)
        await leadWebhookController.subscrive(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockedQuery['hub.challenge'])
    })
  })

})