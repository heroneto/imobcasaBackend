const { userAuthentication, checkAuthentication } = require('./authController')
const { invalidParamError, missingParamError } = require('../Errors/')
const User = require('../models/').User

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    manager: true
  }
  return fakeUser
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



beforeAll(async () => {
  try{
    const fakeUser = mockFakeUser()
    await User.create(fakeUser)
  }catch(err){
    console.log(err.toString())
  }
})

afterAll(async () => {
  try{
    const fakeUser = mockFakeUser()
    await User.destroy({where: {
      username: fakeUser.username
    }})
  }catch(err){
    console.log(err.toString())
  }
})


describe('AUTH CONTROLLER: tests', async() => {
  it('Should return 400 if no username was provided', async () => {
    const {password} = mockFakeUser()
    const req = mockRequest({password})
    const res = mockResponse()
    await userAuthentication(req, res)
    const { error } = missingParamError('username')
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith(error)
  }),
  it('Should return 400 if no password was provided', async () => {
    const {username} = mockFakeUser()
    const req = mockRequest({username})
    const res = mockResponse()
    await userAuthentication(req, res)
    const { error } = missingParamError('password')
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith(error)
  }),
  it('Should return 401 if invalid username has been send', async () => {
    const {password} = mockFakeUser()
    const req = mockRequest({username:'invalidUsername',password })
    const res = mockResponse()
    await userAuthentication(req, res)
    const { error } = invalidParamError('username')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toBeCalledWith(error)
  }),
  it('Should return 401 if invalid password has been send', async () => {
    const {username} = mockFakeUser()
    const req = mockRequest({username, password: 'invalidPassword' })
    const res = mockResponse()
    await userAuthentication(req, res)
    const { error } = invalidParamError('password')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toBeCalledWith(error)
  })
})