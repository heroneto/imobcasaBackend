const { createTask } = require('./tasktypeController');
const { missingParamError } = require('../config/Errors');


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  
const mockRequest = (body) => {
  const request = {}
  request.body = body
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
        test("Should return 400 if no name has been send", async () => {
          const taskType = mockTaskType()
          delete taskType.name  
          const req = mockRequest(taskType)
          const res = mockResponse()
          await createTask(req,res)
          expect(res.status).toHaveBeenCalledWith(400)
          const { error } = missingParamError('name')
          expect(res.send).toHaveBeenCalledWith(error)
        })
    })
})