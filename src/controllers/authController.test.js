const { userAuthentication, checkAuthentication } = require('./authController')
const { invalidParamError, missingParamError } = require('../Errors/')
const User = require('../models/').User
const {databaseSetup} = require('../setup/')

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
    await User.destroy({where: {
      username: fakeUser.username
    }})
  }catch(err){
    console.log(err.toString())
  }
})


describe('AUTH CONTROLLER: tests', () => {
  describe('USERAUTHENTICATION', () => {
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
    }),
    it('Should return 200 if valid password and username has been send', async () => {
      const {username, password} = mockFakeUser()
      const req = mockRequest({username, password})
      const res = mockResponse()
      await userAuthentication(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({token: expect.any(String)})
    })
  }),

  describe('CHECKAUTHENTICATION', () => {
    it('should return 401 if no jwt token was provided', async () => {
      const req = {signedCookies: ''}
      const res = mockResponse()
      await checkAuthentication(req, res)
      const { error } = missingParamError('token')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toBeCalledWith(error)
    });
    it('should return 401 if invalid jwt token was provided ', async () => {
      const req = mockRequestJwtToken('invalidJWT')
      const res = mockResponse()
      await checkAuthentication(req, res)
      const { error } = invalidParamError('token')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toBeCalledWith(error)      
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