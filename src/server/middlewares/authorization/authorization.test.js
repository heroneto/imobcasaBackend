const { invalidParamError, missingParamError, forbidenError } = require('../../helpers/Errors')
const AuthorizationMiddleware = require('./AuthorizationMiddleware')
const authorizationMiddleware = new AuthorizationMiddleware()
const User = require('../../models').users



const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body, query, signedCookies) => {
  const request = {}
  request.body = body
  request.query = query
  request.signedCookies = signedCookies
  return request
}

const mockNext = () => {
  const next = jest.fn()
  return next
}

const mockFakeUser = (admin) => {
  return {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin,
    active: true,
    lastLeadReceivedTime: "123456"
  }
}

describe("AdminController tests", () => {
  const user = {}
  beforeAll(async () => {
    const fakeUserAdmin = mockFakeUser(true)
    const userAdminCreated = await User.create(fakeUserAdmin)
    user.tokenAdmin = await userAdminCreated.generateToken(userAdminCreated.id, userAdminCreated.username)
    
    const fakeUser = mockFakeUser(false)
    const userCreated = await User.create(fakeUser)
    user.token = await userCreated.generateToken(userCreated.id, userCreated.username)

    })

  afterAll(async () => {
    try{
      await User.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe("CheckPrivileges tests", () => {
    test("Should return 400 if no jwt token was provided", async () => {
      const req =  mockRequest({}, {}, {})
      const res = mockResponse()
      await authorizationMiddleware.checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = missingParamError('jwt')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 403 if user has no privileges', async () => {
      const token = {
        jwt: user.token
      }
      const req = mockRequest({}, {}, token)
      const res = mockResponse()
      await authorizationMiddleware.checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(403)
      const {error} = forbidenError()
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should call next function if user has admin privileges', async () => {
      const token = {
        jwt: user.tokenAdmin
      }
      const req = mockRequest({}, {}, token)
      const res = mockResponse()
      const next = mockNext()
      await authorizationMiddleware.checkAdminPrivileges(req, res, next)
      expect(res.status).not.toHaveBeenCalledWith(403)
      expect(next).toHaveBeenCalled()
    })
  })

})