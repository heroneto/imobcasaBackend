const request = require('supertest-session')
const startServer = require('../setup/server')
const startDatabase = require('../setup/database')
const app = startServer()


let fakeUser = {
  fullName: 'fakeValidFullName',
  username: 'fakeValidUsername',
  email: 'fakeValidEmail',
  password: 'fakeValidPassword',
  passwordConfirmation: 'fakeValidPassowdConfirmation',
  manager: 1
}
let csrfToken
const fakeCookieJwt = {
  jwt:"invalidJwt",
  Expires:new Date(Date.now() + 8 * 3600000),
  Path:"/",
  secure: true,
  signed: true,
  HttpOnly: true,
  Domain: "127.0.0.1"
}


let testSession = null

describe('API:USERS tests', () => {

  beforeAll(async ()=>{
    try{
      await startDatabase('test')
      await request(app)
          .post('/user')
          .query({
            token: 'validToken'
          })
          .send(fakeUser)
    }catch(err){
      console.log(err)
    }    
  })

  beforeEach(async () => {
    try{
      testSession = await request(app)
      const res = await testSession.get('/csrf-token')
      csrfToken = res.body.csrfToken
    }catch(err){
      console.log(err.toString())
    }
  })

  describe('AUTH:tests', () => {
    it('GET: Should return 401 if no token was provided', async () =>{
      const res = await request(app)
        .get('/user')
      expect(res.status).toEqual(401)
      expect(res.text).toBe('MissingParamError: token')
    })
    // it('GET:Should return 401 if invalid token was provided', async () => {
    //   const res = await testSession.get('/user')
    //     .withCredentials()
    //   expect(res.status).toEqual(401)
    //   expect(res.text).toBe('InvalidParamError: token')
    // })!!NEED IMPLEMENTETION!!
    it('POST: Should return 403 if invalid csrf token was provided', async () => {
      const res = await request(app).post('/user')
      expect(res.status).toEqual(403)
    })
    it('POST: Should return 403 if invalid csrf token was provided', async () => {
      const res = await testSession.post('/user')
        .set({'x-csrf-token': 'invalidCSRFToken'})
      expect(res.status).toEqual(403)
    })
    it('POST: Should return 401 if no token was provided', async () =>{
      const res = await testSession.get('/user')
        .set({'x-csrf-token': csrfToken})
      expect(res.status).toEqual(401)
      expect(res.text).toBe('MissingParamError: token')
    })
    // it('PUT: Should return 401 if no token was provided', async () =>{
    //   const res = await request(app)
    //     .put('/user')
    //   expect(res.status).toEqual(401)
    //   expect(res.text).toBe('MissingParamError: token')
    // })
    // it('PUT: Should return 401 if invalid token was provided', async () => {
    //   const res = await request(app)
    //     .put('/user')
    //     .query({
    //       token: 'invalidToken'
    //     })
    //   expect(res.status).toEqual(401)
    //   expect(res.text).toBe('InvalidParamError: token')
    // })
    // it('DELETE: Should return 401 if no token was provided', async () =>{
    //   const res = await request(app)
    //     .delete('/user')
    //   expect(res.status).toEqual(401)
    //   expect(res.text).toBe('MissingParamError: token')
    // })
    // it('DELETE: Should return 401 if invalid token was provided', async () => {
    //   const res = await request(app)
    //     .delete('/user')
    //     .query({
    //       token: 'invalidToken'
    //     })
    //   expect(res.status).toEqual(401)
    //   expect(res.text).toBe('InvalidParamError: token')
    // })
  })

  // describe('GET:User route tests', () =>{
  //   it('Should return 200 if valid request was send', async () => {
  //     const res = await request(app)
  //       .get('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //     expect(res.status).toEqual(200)
  //     expect(res.body).toHaveProperty('users')
  //   })
  // })

  // describe('POST:User route tests', () =>{
  //   it('Should return 400 if no fullName was provided', async () => {
  //   const res = await request(app)
  //     .post('/user')
  //     .query({
  //       token: 'validToken'
  //     })
  //     .send({
  //       username: 'validUsername',
  //       email: 'validEmail',
  //       password: 'validPassword',
  //       passwordConfirmation: 'validPassowdConfirmation',
  //       manager: 1
  //     })
  //   expect(res.status).toEqual(400)
  //   expect(res.text).toBe('MissingParamError: fullName')
  //   })
  //   it('Should return 400 if no username was provided', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         email: 'validEmail',
  //         password: 'validPassword',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: username')
  //   })
  //   it('Should return 400 if no email was provided', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         password: 'validPassword',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: email')
  //   })
  //   it('Should return 400 if no password was provided', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: password')
  //   })
  //   it('Should return 400 if no passwordConfirmation was provided', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         password: 'validPassword',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: passwordConfirmation')
  //   })
  //   it('Should return 400 if no manager rule was provided', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         password: 'validPassword',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: manager')
  //   })
  //   it('Should return 200 if user created', async () => {
  //     const res = await request(app)
  //       .post('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         password: 'validPassword',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(200)
  //     expect(res.body).toHaveProperty('user')
  //   })
  // })

  // describe('PUT:User route tests', () =>{
  //   it('Should return 400 if no id was provided', async () => {
  //     const res = await request(app)
  //       .put('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         password: 'validPassword',
  //         passwordConfirmation: 'validPassowdConfirmation',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: id')
  //   })
  //   it('Should return 400 if invalid id was provided', async () => {
  //     const res = await request(app)
  //       .put('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: "invalidUserId",
  //         fullName: 'validFullName',
  //         username: 'validUsername',
  //         email: 'validEmail',
  //         manager: 1
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('InvalidParamError: id')
  //   })
  //   it('Should return 200 if user was updated', async () => {
  //     const res = await request(app)
  //       .put('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: 1,
  //         fullName: 'validFullNameChanged',
  //         username: 'validUsernameChanged',
  //         email: 'validEmailChanged',
  //         password: 'validPasswordChanged',
  //         passwordConfirmation: 'validPassowdConfirmationChanged',
  //         manager: 0
  //       })
  //     expect(res.status).toEqual(200)
  //     expect(res.body).toHaveProperty('user')
  //     expect(res.body.user.id).toEqual(1)
  //     expect(res.body.user.email).toEqual('validEmailChanged')
  //   })
  // })

  // describe('SEARCH:User route tests', () =>{
  //   it('Should return 400 if no search param was provided', async () => {
  //     const res = await request(app)
  //       .get('/search/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: email, username or id')
  //   })
  //   it('Should return 400 if no user found', async () => {
  //     const res = await request(app)
  //       .get('/search/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: 'invalidUserId',
  //         username: 'invalidUsernameChanged',
  //         email: 'invalidEmailChanged'
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('InvalidParamError: no users found')
  //   })
  //   it('Should return 200 if user was find', async () => {
  //     const res = await request(app)
  //       .get('/search/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: 1,
  //         username: 'validUsernameChanged',
  //         email: 'validEmailChanged'
  //       })
  //     expect(res.status).toEqual(200)
  //     expect(res.body).toHaveProperty('users')
  //   })
  // })

  // describe('DELETE:User route tests', () =>{
  //   it('Should return 400 if no id was provided', async () => {
  //     const res = await request(app)
  //       .delete('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('MissingParamError: id')
  //   })
  //   it('Should return 400 if invalid id was provided', async () => {
  //     const res = await request(app)
  //       .delete('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: 'invalidUserId',
  //       })
  //     expect(res.status).toEqual(400)
  //     expect(res.text).toBe('InvalidParamError: id')
  //   })
  //   it('Should return 200 if user was deleted', async () => {
  //     const res = await request(app)
  //       .delete('/user')
  //       .query({
  //         token: 'validToken'
  //       })
  //       .send({
  //         id: 1
  //       })
  //     expect(res.status).toEqual(200)
  //     expect(res.body).toHaveProperty('user')
  //     expect(res.body.user.id).toEqual(1)
  //   })
  // })
})