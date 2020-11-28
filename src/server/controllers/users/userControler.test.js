const { getAllUsers, createUser, updateUser, deleteUser, getUser } = require('./userController')
const databaseSetup = require('../../../database')
const { missingParamError, noResultsError } = require('../config/Errors')
const User = require('../../models').users

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin: true,
    active: true,
    lastLeadReceivedTime: "123456"
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

const mockRequest = (body, query) => {
  const request = {}
  request.body = body
  request.query = query
  return request
}

const getUserModelExpected = () => {
  return {
    active: expect.any(Boolean),
    createdAt: expect.any(Date),
    email: expect.any(String),
    fullName: expect.any(String),
    id: expect.any(Number),
    admin: expect.any(Boolean),
    updatedAt: expect.any(Date),
    username: expect.any(String),
    lastLeadReceivedTime: expect.any(String)
  }
}

beforeAll(async () => {
  try{
    await databaseSetup()
  }catch(err){
    console.log(err.toString())
  }
})

describe('USER CONTROLLER: tests', () =>{
  let userId = ""
  beforeAll(async () => {
    try{
      const fakeUser = mockFakeUser()
      const user  = await User.create(fakeUser)
      userId = user.id
    }catch(err){
      console.log(err)
    }
  })

  afterAll(async () => {
    try{
      await User.destroy({where: {}})
    }catch(err){
      console.log(err)
    }
  })

  describe('POST User tests', () => {
    const requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
    for(const field of requiredFields){
      test(`POST: Should return 400 if no ${field} has beem send`, async() =>{
        const user = mockFakeUser()
        delete user[`${field}`]
        const res = mockResponse()
        const req = mockRequest(user)
        await createUser(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(`MissingParamError: ${field}`)
      })
    }
    test('POST: Should return 200 if user has been created', async () =>{
      const user = mockFakeUser()
      const res = mockResponse()
      const req = mockRequest(user)
      await createUser(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })
  
  describe('GET User tests', () => {
    test('GET: Should return 200', async () =>{
      const res = mockResponse()
      const req = mockRequest()
      await getAllUsers(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({users: expect.any(Array)}))
    })
  })

  describe('PUT User tests', () => {
    test('PUT: Should return 400 if no id and username has beem send', async()=>{
      const user = mockFakeUser()
      delete user.username
      const res = mockResponse()
      const req = mockRequest(user)
      await updateUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toBeCalledWith('MissingParamError: id and username')
    })
    test('PUT: Should return 400 if invalid id and username has beem send', async()=>{
      const user = mockFakeUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mockResponse()
      const req = mockRequest(user)
      await updateUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toBeCalledWith('InvalidParamError: id or username')
    })
    test('PUT: Should return 200 username has beem updated', async()=>{
      const user = mockFakeUser()
      user.id = userId
      const res = mockResponse()
      const req = mockRequest(user)
      await updateUser(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })

  describe('Delete user tests', () => {
    test('DELETE: Should return 400 if no id and username has beem send', async()=>{
      const user = mockFakeUser()
      delete user.id
      delete user.username
      const res = mockResponse()
      const req = mockRequest(user)
      await deleteUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toBeCalledWith('MissingParamError: id')
    })
    test('DELETE: Should return 400 if invalid id and username has beem send', async()=>{
      const user = mockFakeUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mockResponse()
      const req = mockRequest(user)
      await deleteUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toBeCalledWith('InvalidParamError: id or username')
    })
    test('DELETE: Should return 200 username has beem deleted by id', async() =>{
      const res = mockResponse()
      const req = mockRequest({id: userId}, {})
      await deleteUser(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toBeCalledWith({user: expect.objectContaining(getUserModelExpected())})
    })
  })

  describe('Get user by ID', () => {
    let userId = ""
    beforeAll(async () => {
      try{
        const fakeUser = mockFakeUser()
        const user  = await User.create(fakeUser)
        userId = user.id
      }catch(err){
        console.log(err)
      }
    })
  
    afterAll(async () => {
      try{
        await User.destroy({where: {}})
      }catch(err){
        console.log(err)
      }
    })

    test("Should return 400 if no user id has been send", async () => {
      const req = mockRequest({}, {})
      const res = mockResponse()
      await getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test("Should return 204 if id has been send but no user has been found", async () => {
      const req = mockRequest({}, {id: userId+5})
      const res = mockResponse()
      await getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(204)
      const {error} = noResultsError('user')
      expect(res.send).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if user has been found', async () => {
      const req = mockRequest({}, {id: userId})
      const res = mockResponse()
      await getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })

})
