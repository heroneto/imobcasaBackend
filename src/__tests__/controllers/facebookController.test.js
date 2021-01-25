const { FacebookController } = require('../../controllers')
const facebookController = new FacebookController()
const databaseSetup = require('../../database')
const { missingParamError, invalidParamError } = require("../../helpers/Errors")
const Mocks = require('../helpers/Mocks')
const ModelsExpected = require('../helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()



describe("FACEBOOK CONTROLLER Tests", () => {
  beforeAll(async () => {

  })

  describe("LIST PAGE FORMS Tests", () => {
    test("Should not return 200 if invalid after prop has been provided", async () => {
      const queryFields = {
        after: "INVALID_AFTER_PROP"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(undefined, queryFields)
      await facebookController.listPageForms(req, res)
      expect(res.status).not.toHaveBeenCalledWith(200)
    })
    test("Should return 200 ", async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await facebookController.listPageForms(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(modelsExpected.facebookPageFormModel())
    })   
    test("Should return 200 if pass after property", async () => {
      const afterProp = await mocks.mockAfterProp()
      const queryFields = {
        after: afterProp
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(undefined, queryFields)
      await facebookController.listPageForms(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(modelsExpected.facebookPageFormModel())
    }) 
  })
})
