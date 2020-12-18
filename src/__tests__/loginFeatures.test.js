const AuthenticationController = require('../controllers/authentication/AuthenticationController')
const authenticationController = new AuthenticationController()
const { invalidParamError, missingParamError } = require('../controllers/config').errors
const {User} = require('../models')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected
const databaseSetup = require('../database')

describe('AUTH CONTROLLER: tests', () => {
  beforeAll(async () => {
    try{
      databaseSetup()
      await User.create(mocks.mockUser())
    }catch(err){
      console.log(err.toString())
    }
  })
  
  afterAll(async () => {
    try{
      await User.destroy({where: {}})
    }catch(err){
      console.log(err.toString())
    }
  })
  

  describe('USERAUTHENTICATION', () => {
    const requiredFields = ['username', 'password']
    for(const field of requiredFields){
      it(`Should return 400 if no ${field} was provided`, async () => {
        const fakeUser = mocks.mockUser()
        delete fakeUser[`${field}`]
        const req = mocks.mockReq(fakeUser)
        const res = mocks.mockRes()
        await authenticationController.authenticate(req, res)
        const { error } = missingParamError(field)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toBeCalledWith(error)
      })  
    }
    for(const field of requiredFields){
      it(`Should return 401 if ${field} username has been send`, async () => {
        const fakeUser = mocks.mockUser()
        fakeUser[`${field}`] = 'invalidParameter'
        const req = mocks.mockReq(fakeUser)
        const res = mocks.mockRes()  
        await authenticationController.authenticate(req, res)
        const { error } = invalidParamError('Username or Password')
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toBeCalledWith(error)
      })
    }
    it('Should return 200 if valid password and username has been send', async () => {
      const {username, password} = mocks.mockUser()
      const req = mocks.mockReq({username, password})
      const res = mocks.mockRes()
      await authenticationController.authenticate(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.loginExpected()))
    })
  })
})