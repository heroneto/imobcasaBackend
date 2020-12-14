const TaskController = require('../controllers/tasks/TaskController')
const taskController = new TaskController()
const { Task, User, Lead, LeadSource, LeadStatus, TaskType } = require('../models')
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require("../helpers/Errors")
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

  const res = mocks.mockRes()

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
      await taskController._create(req, res)
      const { error } = invalidParamError('userid')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
  })
})