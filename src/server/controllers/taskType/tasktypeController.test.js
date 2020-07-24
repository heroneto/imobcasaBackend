const { createTaskType, getTaskType, updateTaskType, deleteTaskType } = require('./tasktypeController');
const { missingParamError } = require('../config/Errors');
const tasktypeModel = require('../../models').tasktype

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

const mockTaskType = () => {
  return {
    name: "taskTypeName",
    description: "tasktypeDescription",
    active: true
  }
}
  

describe("Task Type Tests", () => {
    describe("POST: Create task type tests.", () =>{
      afterAll( async () => {
        try{
          await tasktypeModel.destroy({where:{}})
        }catch(err){
          console.log(err)
        }
      })
      test("Should return 400 if no name has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.name  
        const req = mockRequest(taskType)
        const res = mockResponse()
        await createTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('name')
        expect(res.send).toHaveBeenCalledWith(error)
      }),
      test("Should return 400 if no description has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.description  
        const req = mockRequest(taskType)
        const res = mockResponse()
        await createTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('description')
        expect(res.send).toHaveBeenCalledWith(error)
      })
      test("Should return 400 if no active has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.active  
        const req = mockRequest(taskType)
        const res = mockResponse()
        await createTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('active')
        expect(res.send).toHaveBeenCalledWith(error)
      })
      test("Should return 200 if tasktype has been registred", async () => {
        const taskType = mockTaskType()
        const req = mockRequest(taskType)
        const res = mockResponse()
        await createTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
          active: expect.any(Boolean),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: expect.any(String),
          description: expect.any(String),
        }))
      })
    }),
    describe("GET: get task type", () => {
      let id = ""
      beforeAll( async ()=>{
        try{
          const tasktype = await tasktypeModel.create(mockTaskType())
          id = tasktype.id
        }catch(err){
          console.log(err)
        }
      })
      afterAll(async () => {
        try{
          await tasktypeModel.destroy({where: {
            id: id
          }})
        }catch(err){
          console.log(err)
        }
      })
      test("Should return 400 if no id has been send", async () => {
        const req = mockRequest({}, {})
        const res = mockResponse()
        await getTaskType(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
      }),
      test("Should return 200 if id has been send", async () => {
        const req = mockRequest({}, {id})
        const res = mockResponse()
        await getTaskType(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
          active: expect.any(Boolean),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: expect.any(String),
          description: expect.any(String),
        }))
      })
    }),
    describe("PUT: update a task type", () => {
      let id = ""
      beforeAll( async ()=>{
        try{
          const tasktype = await tasktypeModel.create(mockTaskType())
          id = tasktype.id
        }catch(err){
          console.log(err)
        }
      })
      afterAll(async () => {
        try{
          await tasktypeModel.destroy({where: {
            id: id
          }})
        }catch(err){
          console.log(err)
        }
      }),

      test("Should return 400 if no id has been send", async () => {
        const req = mockRequest({}, {})
        const res = mockResponse()
        await updateTaskType(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
      }),
      test("Should return 400 if no name has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.name  
        const req = mockRequest(taskType, {id})
        const res = mockResponse()
        await updateTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('name')
        expect(res.send).toHaveBeenCalledWith(error)
      }),
      test("Should return 400 if no description has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.description  
        const req = mockRequest(taskType, {id})
        const res = mockResponse()
        await updateTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('description')
        expect(res.send).toHaveBeenCalledWith(error)
      })
      test("Should return 400 if no active has been send", async () => {
        const taskType = mockTaskType()
        delete taskType.active  
        const req = mockRequest(taskType, {id})
        const res = mockResponse()
        await updateTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError('active')
        expect(res.send).toHaveBeenCalledWith(error)
      }),
      test("Should return 200 if tasktype has been updated", async () => {
        const taskType = mockTaskType()
        taskType.name = "updatedTaskType"
        const req = mockRequest(taskType, {id})
        const res = mockResponse()
        await updateTaskType(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
          active: expect.any(Boolean),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: taskType.name,
          description: expect.any(String),
        }))
      })
    }),
    describe("DELETE: delete a task type", () => {
      let id = ""
      beforeAll( async ()=>{
        try{
          const tasktype = await tasktypeModel.create(mockTaskType())
          id = tasktype.id
        }catch(err){
          console.log(err)
        }
      })
      afterAll(async () => {
        try{
          await tasktypeModel.destroy({where: {
            id: id
          }})
        }catch(err){
          console.log(err)
        }
      })
      test("Should return 400 if no id has been send", async () => {
        const req = mockRequest({}, {})
        const res = mockResponse()
        await deleteTaskType(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
      })
    })
})