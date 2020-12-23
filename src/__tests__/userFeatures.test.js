const UserController = require('../controllers/user/UserController')
const userController = new UserController()
const databaseSetup = require('../database')
const { missingParamError, invalidParamError } = require('../helpers/Errors')
const { User } = require('../models')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()

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
      const user  = await User.create(mocks.mockUser())
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
        const user = mocks.mockUser()
        delete user[`${field}`]
        const res = mocks.mockRes()
        const req = mocks.mockReq(user)
        await userController._create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(`MissingParamError: ${field}`)
      })
    }
    test('POST: Should return 200 if user has been created', async () =>{
      const user = mocks.mockUser()
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })
  
  describe('GET User tests', () => {
    test('GET: Should return 200', async () =>{
      const res = mocks.mockRes()
      const req = mocks.mockReq()
      await userController._list(req,res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.userModel())]))
    })
  })

  describe('PUT User tests', () => {
    test('PUT: Should return 400 if no id has beem send', async()=>{
      const user = mocks.mockUser()
      delete user.username
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('PUT: Should return 400 if invalid id has beem send', async()=>{
      const user = mocks.mockUser()
      user.id = 'invalidId'
      user.username = 'invalidUsername'
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('PUT: Should return 200 username has beem updated', async()=>{
      const user = mocks.mockUser()
      user.id = userId
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })

  describe('DELETE User tests', () => {
    test('DELETE: Should return 400 if no id has beem send', async()=>{
      const user = mocks.mockUser()
      delete user.id
      delete user.username
      const res = mocks.mockRes()
      const req = mocks.mockReq(user)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('MissingParamError: id')
    })
    test('DELETE: Should return 400 if invalid id has beem send', async()=>{
      const user = mocks.mockUser()
      user.id = 'invalidId'
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {id: "invalid user id"}, null)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toBeCalledWith('InvalidParamError: id')
    })
    test('DELETE: Should return 200 username has beem deleted by id', async() =>{
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {id: userId}, null)
      await userController._delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(1)
    })
  })

  describe('GET USER BY ID', () => {
    let userId = ""
    beforeAll(async () => {
      try{
        const user  = await User.create(mocks.mockUser())
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
      const req = mocks.mockReq()
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("Should return 400 if invalid id has been send", async () => {
      const req = mocks.mockReq(null, null, {id: "invalid user id"}, null )
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const {error} = invalidParamError('id')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test('Should return 200 if user has been found', async () => {
      const req = mocks.mockReq(null, null, {id:userId}, null )
      const res = mocks.mockRes()
      await userController._getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.userModel()))
    })
  })
})
