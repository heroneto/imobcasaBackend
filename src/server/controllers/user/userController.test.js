const UserController = require('./UserController')
const userController = new UserController()
const databaseSetup = require('../../../database')
const { missingParamError, invalidParamError } = require('../config/Errors')
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
    id: expect.any(String),
    admin: expect.any(Boolean),
    updatedAt: expect.any(Date),
    username: expect.any(String),
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
        await userController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(`MissingParamError: ${field}`)
      })
    }
    test('POST: Should return 200 if user has been created', async () =>{
      const user = mockFakeUser()
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })
  
  describe('GET User tests', () => {
    test('GET: Should return 200', async () =>{
      const res = mockResponse()
      const req = mockRequest()
      await userController._list(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(getUserModelExpected())]))
    })
  })

  describe('PUT User tests', () => {
    test('PUT: Should return 400 if no id has beem send', async()=>{
      const user = mockFakeUser()
      delete user.username
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('PUT: Should return 400 if invalid id has beem send', async()=>{
      const user = mockFakeUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('PUT: Should return 200 username has beem updated', async()=>{
      const user = mockFakeUser()
      user.id = userId
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })

  describe('DELETE User tests', () => {
    test('DELETE: Should return 400 if no id has beem send', async()=>{
      const user = mockFakeUser()
      delete user.id
      delete user.username
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('DELETE: Should return 400 if invalid id has beem send', async()=>{
      const user = mockFakeUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mockResponse()
      const req = mockRequest(user)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('DELETE: Should return 200 username has beem deleted by id', async() =>{
      const res = mockResponse()
      const req = mockRequest({id: userId}, {})
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(1)
    })
  })

  describe('GET USER BY ID', () => {
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

    test("Should return 400 if no id has been send", async () => {
      const req = mockRequest({}, {})
      const res = mockResponse()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid id has been send", async () => {
      const req = mockRequest({}, {id: userId+5})
      const res = mockResponse()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = invalidParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if user has been found', async () => {
      const req = mockRequest({}, {id: userId})
      const res = mockResponse()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(getUserModelExpected()))
    })
  })

})
