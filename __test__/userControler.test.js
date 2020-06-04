const { getAllUsers, createUser } = require('../src/controllers/userController')



const fakeUser = {
  username: "validUser",
	fullName: "ValidFullName",
	email: "valid@email.com",
	password: "validPassword",
	passwordConfirmation: "validPassword",
	manager: true
}

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

describe('USER CONTROLLER: tests', async () =>{
  it('GET: Should return 200', async () =>{
    const res = mockResponse()
    const req = mockRequest()
    await getAllUsers(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({users: []})
  })
  it('POST: Should return 400 if no Username has beem send', async() =>{
    var mockFakeUser = fakeUser
    delete mockFakeUser.username
    const res = mockResponse()
    const req = mockRequest(mockFakeUser)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: username')

  })
})
