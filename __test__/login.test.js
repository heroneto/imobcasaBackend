const request = require('supertest')
const startServer = require('../setup/server')
const startDatabase = require('../setup/database')
const app = startServer()


let fakeUser = {
  fullName: 'validFullName',
  username: 'validUsername',
  email: 'validEmail',
  password: 'validPassword',
  passwordConfirmation: 'validPassowdConfirmation',
  manager: 1
}
let token

describe('API:AUTH tests', () => {

  beforeAll(async ()=>{
    try{
      await startDatabase('test')
      const res = await request(app)
          .post('/user')
          .query({
            token: 'validToken'
          })
          .send(fakeUser)
    }catch(err){
      console.log(err)
    }    
  })
  describe('POST:AUTH tests', () => {
    it('return 400 if no username was provided', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          // username: 'vaqlidUser',
          password: 'validPassword',
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: username')
    })
    it('return 400 if no password was provided', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'vaqlidUser',
          // password: 'validPassword',
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: password')
    })
    it('return 401 if username is invalid', async() => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'invalidUser',
          password: 'validPassword',
        })
      expect(res.status).toEqual(401)
      expect(res.text).toBe('InvalidParamError: username')
    })
  })  
})