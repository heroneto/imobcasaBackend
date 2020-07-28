const { invalidParamError, missingParamError } = require('../../controllers/config').errors
const { checkAdminPrivileges } = require('./adminController')
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

// const mockJwtToken = async (username) => {
//   const user = await User.findOne({where: {username: username}})  
//   const token = await user.generateToken(user.id, user.username)
//   return token
// }


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
    test("Should return 403 if no jwt token was provided", async () => {
      const req =  mockRequest({}, {}, {})
      const res = mockResponse()
      await checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(403)
      const {error} = missingParamError('jwt')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test('Should return 403 if user has no privileges', async () => {
      const token = {
        jwt: user.token
      }
      const req = mockRequest({}, {}, token)
      const res = mockResponse()
      await checkAdminPrivileges(req, res)
      expect(res.status).toHaveBeenCalledWith(403)
      const {error} = invalidParamError('jwt')
      expect(res.send).toHaveBeenCalledWith(error)
    })
  })

})