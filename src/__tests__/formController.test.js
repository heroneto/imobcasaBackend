const {FormController} = require('../controllers')
const formController = new FormController()
const {Form} = require('../models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require("../helpers/Errors")
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

beforeAll(async () => {
  try{
    await databaseSetup()
  }catch(err){
    console.log(err.toString())
  }
})

describe('FORM CONTROLLER: tests', () => {
  let formId = ""
  beforeAll(async () => {
    try{
      const form = await Form.create(mocks.mockForm())
      formId = form.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await Form.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("POST Tests", () => {
    const postRequiredFields = ["name", "active", "fbCreatedDate", "fbFormId"]
    for(const field of postRequiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const fakeForm = mocks.mockForm()
        delete fakeForm[`${field}`]
        const req = mocks.mockReq(fakeForm, {}, {})
        const res = mocks.mockRes()
        await formController.create(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })      
    }
    test('Should return 201 if form was created', async () => {
      const fakeForm = mocks.mockForm()
      const req = mocks.mockReq(fakeForm, {}, {})
      const res = mocks.mockRes()
      await formController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.formModel()))
    })
  })
  describe("LIST tests", () => {
    test("Should return 200", async () => {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await formController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.formModel())]))
    })
  })
  describe("GET ONE tests", () => {
    test("Should return 400 if invalid id has been send", async () => {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await formController.getOne(req, res)
      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async () => {
      const req = mocks.mockReq({}, {}, {id: formId})
      const res = mocks.mockRes()
      await formController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.formModel()))
    })
  })
  describe("ACTIVATE Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await formController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await formController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: formId})
      const res = mocks.mockRes()
      await formController.activate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
  describe("INACTIVATE Tests", ()=> {
    test("Should return 0 on result array if invalid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: "invalid id"})
      const res = mocks.mockRes()
      await formController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([0]))
    })
    test("Should return 404 if no id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {})
      const res = mocks.mockRes()
      await formController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    test("Should return 200 if valid id has been send", async ()=> {
      const req = mocks.mockReq({}, {}, {id: formId})
      const res = mocks.mockRes()
      await formController.inactivate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([1]))
    })
  })
})