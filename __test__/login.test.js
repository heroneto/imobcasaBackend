const request = require('supertest')
const startServer = require('../setup/server')
const startDatabase = require('../setup/database')
const app = startServer()


let token

describe('API:AUTH tests', () => {

  beforeAll(async ()=>{
    try{
      await startDatabase('test')
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
  })  
})