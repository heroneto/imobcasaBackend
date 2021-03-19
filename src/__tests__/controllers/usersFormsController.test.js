const {UserFormController} = require("../../controllers")
const userFormController = new UserFormController()
const { User, Form, UsersForms } = require('../../models')
const databaseSetup = require('../../database')
const { missingParamError, invalidParamError } = require("../../helpers/Errors")
const ModelsExpected = require('../helpers/ModelsExpected')
const Mocks = require('../helpers/Mocks')
const modelsExpected = new ModelsExpected()
const mocks = new Mocks()

beforeAll(async () => {
  try{
    await databaseSetup()
  }catch(err){
    console.log(err.toString())
  }
})

describe("USERFORM Controller tests", () => {
  let userid = ""
  let formid = ""
  beforeAll(async () => {
    try{
      const user = await User.create(mocks.mockUser())
      userid = user.id
      const form = await Form.create(mocks.mockForm())
      formid = form.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await UsersForms.destroy({where: {}})
      await User.destroy({where: {}})
      await Form.destroy({where: {}})
     
    }catch(err){
      console.log(err)
    }
  })

  describe("ADD tests", () => {
    const requiredFields = ["userid", "formid"]  
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userFormController.add(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test("Should return 400 if invalid userid has been send", async () => {
      const parameters = {
        userid: "invaliduserid",
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.add(req, res)
      const { error } = invalidParamError("userid")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid formid has been send", async () => {
      const parameters = {
        userid: userid,
        formid: 'invalidformid'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.add(req, res)
      const { error } = invalidParamError("formid")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })

    test("Should return 200 if item was created", async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)     
      await userFormController.add(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userFormModel()))
    })

    test("Should return 400 if userid already exists in form", async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)     
      await userFormController.add(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith("User already exists in this form")
    })
  })

  describe("LIST User form tests", () => {
    test("Should return 400 if no formid has been provided", async () => {
      const parameters = {
        formid: formid
      }
      delete parameters.formid
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)      
      await userFormController.list(req, res)
      const { error } = missingParamError('formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if valid formid has been provided", async () => {
      const parameters = {
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)      
      await userFormController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.listUserFormModel())]))
    })
  })

  describe("ENABLE User form tests", () => {
    const requiredFields = ["userid", "formid"]
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userFormController.enable(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.enable(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        formid: 'invalid form ID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.enable(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.enable(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userFormModel(),
        enabled: true
      }))
    })
  })

  describe("DISABLE User form tests", () => {
    const requiredFields = ["userid", "formid"]
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userFormController.disable(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.disable(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        formid: 'invalid form ID'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.disable(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if valid userid and formid has been provided`, async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.disable(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userFormModel(),
        enabled: false
      }))
    })
  })


  describe("UPDATE User in form tests", () => {
    const requiredParamFields = ["userid", "formid"]
    for(const field of requiredParamFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        delete parameters[`${field}`]
        const body = {
          score: 50,
          enabled: true,
          lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
        }
        const res = mocks.mockRes()
        const req = mocks.mockReq(body, null, parameters)
        
        await userFormController.update(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    const requiredBodyFields = ["score", "enabled", "lastLeadReceivedTime"]
    for(const field of requiredBodyFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        const body = {
          score: 50,
          enabled: true,
          lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
        }
        delete body[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(body, null, parameters)
        
        await userFormController.update(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: 'Invalid UserID',
        formid: formid
      }
      const body = {
        score: 50,
        enabled: true,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userFormController.update(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid userid has been provided`, async () => {
      const parameters = {
        userid: userid,
        formid: 'invalid form ID'
      }
      const body = {
        score: 50,
        enabled: true,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userFormController.update(req, res)
      const { error } = invalidParamError('userid or formid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if all fields has been provided and user updated`, async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const body = {
        score: 100,
        enabled: false,
        lastLeadReceivedTime: "2021-01-04T23:55:28.666Z"
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(body, null, parameters)
      
      await userFormController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.userFormModel(),
        ...body,
        lastLeadReceivedTime: expect.any(Date),
      }))
    })
  })
  describe("DELETE User form tests", () => {
    const requiredFields = ["userid", "formid"]  
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been send`, async () => {
        const parameters = {
          userid: userid,
          formid: formid
        }
        delete parameters[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(null, null, parameters)
        
        await userFormController.remove(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    test("Should return 200 if invalid userid has been send", async () => {
      const parameters = {
        userid: "invaliduserid",
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })
    test("Should return 200 with 0 in body if invalid form has been send", async () => {
      const parameters = {
        userid: userid,
        formid: 'invalidformid'
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(0)
    })

    test("Should return 200 valid formid and userid has been provided", async () => {
      const parameters = {
        userid: userid,
        formid: formid
      }
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, parameters)
      
      await userFormController.remove(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })
  })
})