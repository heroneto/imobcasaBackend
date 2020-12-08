const AuthenticationController = require('./AuthenticationController')
const authenticationController = new AuthenticationController()

const { invalidParamError, missingParamError } = require('../config').errors
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
  describe('USERAUTHENTICATION', () => {
    const requiredFields = ['username', 'password']
    for(const field of requiredFields){
      it(`Should return 400 if no ${field} was provided`, async () => {
        const fakeUser = mockFakeUser()
        delete fakeUser[`${field}`]
        const req = mockRequest(fakeUser)
        const res = mockResponse()
        await authenticationController.authenticate(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(error)
      })  
    }
    for(const field of requiredFields){
      it(`Should return 401 if ${field} username has been send`, async () => {
        const fakeUser = mockFakeUser()
        fakeUser[`${field}`] = 'invalidParameter'
        const req = mockRequest(fakeUser)
        const res = mockResponse()
  
        await authenticationController.authenticate(req, res)
        const { error } = invalidParamError('Username or Password')
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toBeCalledWith(error)
      })
    }
    it('Should return 200 if valid password and username has been send', async () => {
      const {username, password} = mockFakeUser()
      const req = mockRequest({username, password})
      const res = mockResponse()
      await authenticationController.authenticate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.any(String))
    }
    )
  })
})