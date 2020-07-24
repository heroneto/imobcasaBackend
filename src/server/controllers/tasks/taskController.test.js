const { createTask } = require('./taskController')
const { missingParamError } = require('../config').errors
const Tasks = require('../../models').tasks
const LeadStatus = require('../../models').leadstatuses
const User = require('../../models').User
const Leads = require('../../models').Leads
const Tasktype = require('../../models').tasktype
const TaskStatus = require('../../models').taskstatus

const mockTask = (userid, leadid) => {
  return {
    title: "Valid Task Title",
    description: "Valid task description",
    userid: userid || null,
    leadid: leadid || null,
    statusid: "",
    tasktypeid: "",
    startdate: "" ,
    resolutiondate: ""
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

describe("Task controller tests", () => {

  beforeAll(async () => {
    try{
      const leadstatus = await LeadStatus.create({
        name: "new",
        description: "New Lead status",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      const tasktype = await Tasktype.create({
        name: "valid task type",
        description: "valid task type description",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      const taskstatus = await TaskStatus.create({
        name: "valid task status",
        description: "valid task status description",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      const user = await User.create({
        fullName: "valid user",
        username: "valid useraname",
        email: "validEmail",
        password: "123456",
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const lead = await Leads.create({
        name: "valid Lead",
        phone: "valid phone number",
        source: "valid source",
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        statusid: leadstatus.id
      })

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
      const taskMock = mockTask()
      delete taskMock.userid
      const req = mockRequest(taskMock)
      const res = mockResponse()
      await createTask(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('userid')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    
  })
})
