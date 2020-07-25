const { createTask, getTask } = require('./taskController')
const { missingParamError, invalidParamError } = require('../config').errors
const Tasks = require('../../models').task
const LeadStatus = require('../../models').leadstatus
const User = require('../../models').users
const Leads = require('../../models').lead
const Tasktype = require('../../models').tasktype
const TaskStatus = require('../../models').taskstatus

const mockTask = (userid, leadid, statusid, tasktypeid) => {
  return {
    title: "Valid Task Title",
    description: "Valid task description",
    userid: userid || null,
    leadid: leadid || null,
    statusid: statusid || null,
    tasktypeid: tasktypeid || null,
    startdate: new Date() ,
    resolutiondate: new Date()
  }
}

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body, query) => {
const request = {}
request.body = body || {}
request.query = query || {}
return request
}

const generateInvalidId = () => {
  return Math.round(Math.random()*200)*Math.round(Math.random()*200)
}

const taskResponseModel = () => {
  return {
    id: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    leadid: expect.any(Number),
    userid: expect.any(Number),
    startdate: expect.any(Date),
    resolutiondate: expect.any(Date),
    tasktypeid: expect.any(Number),
    statusid: expect.any(Number)
  }
}

describe("Task controller tests", () => {
  const ids = {}
  beforeAll(async () => {
    try{
      const leadstatus = await LeadStatus.create({
        name: "new",
        description: "New Lead status",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ids.leadstatusid = leadstatus.id
      const tasktype = await Tasktype.create({
        name: "valid task type",
        description: "valid task type description",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ids.tasktypeid = tasktype.id
      const status = await TaskStatus.create({
        name: "valid task status",
        description: "valid task status description",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ids.statusid = status.id
      const user = await User.create({
        fullName: "valid user",
        username: "valid useraname",
        email: "validEmail",
        password: "123456",
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ids.userid = user.id
      const lead = await Leads.create({
        name: "valid Lead",
        phone: "valid phone number",
        source: "valid source",
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        statusid: leadstatus.id
      })
      ids.leadid = lead.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await Leads.destroy({where: {}})
      await User.destroy({where: {}})
      await TaskStatus.destroy({where: {}})
      await Tasktype.destroy({where: {}})
      await LeadStatus.destroy({where: {}})             
    }catch(err){
      console.log(err)
    }
  })

  describe("POST task", () => {
    afterAll(async () => {
      try{
        await Tasks.destroy({where: {}})
      }catch(err){
        console.log(err)
      }
    })
    test("Should return 400 if no userid has been send", async () => {
      const taskMock = mockTask("userid", "leadid", "statusid", "tasktypeid")
      delete taskMock.userid
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('userid')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if no leadid has been send", async () => {
      const taskMock = mockTask("userid", "leadid", "statusid", "tasktypeid")
      delete taskMock.leadid
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('leadid')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if no statusid has been send", async () => {
      const taskMock = mockTask("userid", "leadid", "statusid", "tasktypeid")
      delete taskMock.statusid
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('statusid')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if no tasktypeid has been send", async () => {
      const taskMock = mockTask("userid", "leadid", "statusid", "tasktypeid")
      delete taskMock.tasktypeid
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('tasktypeid')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if no title has been send", async () => {
      const taskMock = mockTask("userid", "leadid", "statusid", "tasktypeid")
      delete taskMock.title
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('title')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid tasktypeid has been send", async () => {
      const invalidRamdonId  = generateInvalidId()
      const taskMock = mockTask(ids.userid, ids.leadid, ids.statusid, invalidRamdonId)
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError(['tasktypeid'])
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid statusid has been send", async () => {
      const invalidRamdonId  = generateInvalidId()
      const taskMock = mockTask(ids.userid, ids.leadid, invalidRamdonId, ids.tasktypeid)
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError(['statusid'])
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid leadid has been send", async () => {
      const invalidRamdonId  = generateInvalidId()
      const taskMock = mockTask(ids.userid, invalidRamdonId, ids.statusid, ids.tasktypeid)
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError(['leadid'])
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid userid has been send", async () => {
      const invalidRamdonId  = generateInvalidId()
      const taskMock = mockTask(invalidRamdonId, ids.leadid, ids.statusid, ids.tasktypeid)
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError(['userid'])
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 200 if task has been created", async () => {
      const taskMock = mockTask(ids.userid, ids.leadid, ids.statusid, ids.tasktypeid)
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
            updatedAt: expect.any(Date),
            createdAt: expect.any(Date),
            id: expect.any(Number),
            ...taskMock
          })
        )
    })
  })

  describe("GET task", () => {
    let taskid = ""
    beforeAll(async () => {
      try{
        const taskMock = mockTask(ids.userid, ids.leadid, ids.statusid, ids.tasktypeid)
        const task = await Tasks.create(taskMock)
        taskid = task.id
      }catch(err){
        console.log(err)
      }
    })
    afterAll(async () => {
      try{
        await Tasks.destroy({where: {}})
      }catch(err){
        console.log(err)
      }
    })
    test("Should return 400 if no task id has been send", async () => {
      const req = mockRequest({}, {})
      const res = mockResponse()
      await getTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('id')
      expect(res.send).toHaveBeenLastCalledWith(error)
    })
    test("Should return 400 if invalid task id has been send", async () => {
      const invalidRamdonId  = generateInvalidId()
      const req = mockRequest({}, {id: invalidRamdonId})
      const res = mockResponse()
      await getTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = invalidParamError('id')
      expect(res.send).toHaveBeenLastCalledWith(error)
    })
    test("Should return 200 if valid task id has been send", async () => {
      const req = mockRequest({}, {id: taskid})
      const res = mockResponse()
      await getTask(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenLastCalledWith(expect.objectContaining(taskResponseModel()))
    })
  })
})
