const TaskController = require('../controllers/tasks/TaskController')
const taskController = new TaskController()
const { Task, User, Lead, LeadSource, LeadStatus, TaskType } = require('../models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError, forbidenError } = require("../helpers/Errors")
const ModelsExpected = require('./helpers/ModelsExpected')
const Mocks = require('./helpers/Mocks')
const modelsExpected = new ModelsExpected()
const mocks = new Mocks()


describe("TASKS FEATURES Tests", () => {
  let task = null
  let lead = null
  let leadSource = null
  let leadStatus = null
  let adminUser = null
  let limitedUser = null
  let taskType = null
 

  beforeAll(async () => {
    try{
      await databaseSetup()
      adminUser = await User.create(mocks.mockUser(true))
      limitedUser = await User.create(mocks.mockUser(false))
      leadSource = await LeadSource.create(mocks.mockLeadSource())
      leadStatus = await LeadStatus.create(mocks.mockLeadStatus())
      lead = await Lead.create(mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id))
      taskType = await TaskType.create(mocks.mockTaskType())
      task = await Task.create(mocks.mockTask(adminUser.id, lead.id, taskType.id))
    }catch(error){
      console.error(error)
    }
  })

  afterAll(async () => {
    await Task.destroy({where: {}})
    await TaskType.destroy({where: {}})    
    await Lead.destroy({where: {}})
    await LeadSource.destroy({where: {}})
    await LeadStatus.destroy({where: {}})
    await User.destroy({where: {}})
  })

  describe("POST tests", () => {
    const requiredFields = ["title", "description", "userid", "leadid", "active", "startdate", "tasktypeid"]
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const locals = {
          reqUserId: adminUser.id,
          admin: adminUser.admin
        }
        const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
        delete body[`${field}`]
        const req = mocks.mockReq(body, null, null, locals)
        const res = mocks.mockRes()
        await taskController._create(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })              
    }
    test(`Should return 400 if no reqUserId has been provided`, async () => {
      const locals = {
        admin: adminUser.admin
      }
      const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._create(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no admin has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
      }
      const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._create(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid leadid has been proveided", async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const body = mocks.mockTask(adminUser.id, "InvalidLeadId", taskType.id)
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._create(req, res)
      const { error } = invalidParamError('leadid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid userid has been proveided", async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const body = mocks.mockTask("invalidUserId", lead.id, taskType.id)
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._create(req, res)
      const { error } = invalidParamError('userid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if valid fields has been proveided", async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.taskModel()))
    })
  })

  describe("LISTBYLEAD Tests", () => {
    test(`Should return 400 if no leadid has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {        
      }
      const req = mocks.mockReq(null, null , params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      const { error } = missingParamError('leadid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no reqUserId has been provided`, async () => {
      const locals = {
        admin: adminUser.admin
      }
      const params = {  
        leadid: lead.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })  
    test(`Should return 400 if no admin has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
      }
      const params = {  
        leadid: lead.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid leadid has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        leadid: "invalid lead id"
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      const { error } = invalidParamError('leadid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 403 if userid does not exists in lead fields of leadid provided and user is admin is false`, async () => {
      const locals = {
        reqUserId: limitedUser.id,
        admin: limitedUser.admin
      }
      const params = {  
        leadid: lead.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      const { error } = forbidenError()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if correct fields has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        leadid: lead.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._listByLead(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.taskModel())]))
    }) 
     
  })

  describe("GET ONE Tests", () => {
    test(`Should return 400 if no id has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      const { error } = missingParamError('id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no reqUserId has been provided`, async () => {
      const locals = {
        admin: adminUser.admin
      }
      const params = {  
        id: task.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })  
    test(`Should return 400 if no admin has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
      }
      const params = {  
        id: task.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid id has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        id: "invalid task id"
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      const { error } = invalidParamError('id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 403 userid does not exists in task fields and admin is false`, async () => {
      const locals = {
        reqUserId: limitedUser.id,
        admin: limitedUser.admin
      }
      const params = {  
        id: task.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      const { error } = forbidenError()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if correct fields has provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        id: task.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.taskModel()))
    })
  })

  describe("UPDATE TASK Tests", () => {
    const requiredFields = ["id", "title", "description", "userid", "leadid", "active", "startdate", "tasktypeid"]
    for(const field of requiredFields){
      test(`Should return 400 if no ${field} has been provided`, async () => {
        const locals = {
          reqUserId: adminUser.id,
          admin: adminUser.admin
        }
        const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
        body.id = task.id
        body.resolutionDate = new Date().toISOString()
        delete body[`${field}`]
        const req = mocks.mockReq(body, null, null, locals)
        const res = mocks.mockRes()
        await taskController._update(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(error)
      })    
    }
    test(`Should return 400 if no reqUserId has been provided`, async () => {
      const locals = {
        admin: adminUser.admin
      }
      const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
      body.id = task.id
      body.resolutionDate = new Date().toISOString()
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._update(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })   
    test(`Should return 400 if no admin has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
      }
      const body = mocks.mockTask(adminUser.id, lead.id, taskType.id)
      body.id = task.id
      body.resolutionDate = new Date().toISOString()
      const req = mocks.mockReq(body, null, null, locals)
      const res = mocks.mockRes()
      await taskController._update(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })   
  })

  describe("DELETE ONE Tests", () => {
    test(`Should return 400 if no id has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      const { error } = missingParamError('id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if no reqUserId has been provided`, async () => {
      const locals = {
        admin: adminUser.admin
      }
      const params = {  
        id: task.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      const { error } = missingParamError('reqUserId')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })  
    test(`Should return 400 if no admin has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
      }
      const params = {  
        id: task.id      
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      const { error } = missingParamError('admin')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 400 if invalid id has been provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        id: "invalid task id"
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      const { error } = invalidParamError('id')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 403 userid does not exists in task fields and admin is false`, async () => {
      const locals = {
        reqUserId: limitedUser.id,
        admin: limitedUser.admin
      }
      const params = {  
        id: task.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      const { error } = forbidenError()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`Should return 200 if correct fields has provided`, async () => {
      const locals = {
        reqUserId: adminUser.id,
        admin: adminUser.admin
      }
      const params = {  
        id: task.id
      }
      const req = mocks.mockReq(null, null, params, locals)
      const res = mocks.mockRes()
      await taskController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })
  })
})