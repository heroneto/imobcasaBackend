const { checkAuthentication } = require('./authController')
const { invalidParamError, missingParamError } = require('../../controllers/config').errors
const User = require('../../models').users
const databaseSetup = require('../../../database')

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin: true,
    active: true,
    lastLeadReceivedTime: new Date().getTime()
  }
  return fakeUser
}

const mockNext = () => {
  const next = jest.fn()
  return next
}

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.cookie = jest.fn().mockReturnValue(res)
  return res
};

const mockRequest = (body) => {
  const request = {}
  request.body = body
  return request
}

const mockRequestJwtToken = (jwt) => {
  const request = {}
  request.signedCookies = {
    jwt
  }
  return request
}

const mockJwtToken = async (username) => {
  const user = await User.findOne({where: {username: username}})  
  const token = await user.generateToken(user.id, user.username)
  return token
}

beforeAll(async () => {
  try{
    databaseSetup()
    const fakeUser = mockFakeUser()
    await User.create(fakeUser)
  }catch(err){
    console.log(err.toString())
  }
})

afterAll(async () => {
  try{
    const fakeUser = mockFakeUser()
    await User.destroy({where: {}})
  }catch(err){
    console.log(err.toString())
  }
})


describe('AUTH CONTROLLER: tests', () => {
  describe('CHECKAUTHENTICATION', () => {
    it('should return 400 if no jwt token was provided', async () => {
      const req = {signedCookies: ''}
      const res = mockResponse()
      await checkAuthentication(req, res)
      const { error } = missingParamError('jwt')
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith(error)
    });
    it('should return 401 if invalid jwt token was provided ', async () => {
      const req = mockRequestJwtToken('InvalidJWT')
      const res = mockResponse()
      await checkAuthentication(req, res)
      const { error } = invalidParamError('token')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toBeCalledWith(error)      
    });
    it('should call next if valid jwt token was provided', async () => {
      const fakeUser = mockFakeUser()
      const jwt = await mockJwtToken(fakeUser.username)
      const req = mockRequestJwtToken(jwt)
      const res = mockResponse()
      const next = mockNext()
      await checkAuthentication(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(401)
      expect(next).toHaveBeenCalled()
    })
  });
  
})