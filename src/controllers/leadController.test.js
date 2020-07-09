const {getLead} = require('./leadController')
const { invalidParamError, missingParamError } = require('../Errors/')

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

const mockRequest = (body) => {
  const request = {}
  request.body = body
  return request
}

describe('LEAD CONTROLLER: tests', async () => {
  it('GET: Should return 400 if no id has been send', async () => {
    const res = mockResponse()
    const req = mockRequest({})
    await getLead(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    const { error } = missingParamError("id")
    expect(res.send).toBeCalledWith(error)
  })
  it('GET: Should return 400 is invalid id has been send', async () => {
    const res = mockResponse()
    const req = mockRequest({id: "InvalidId"})
    await getLead(req, res)
    expect(res.status).toBeCalledWith(400)
    const { error } = invalidParamError('id')
    expect(res.send).toBeCalledWith(error)
  })
})