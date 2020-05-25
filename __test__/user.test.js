const request = require('supertest')
const server = require('../setup/server')
const app = server()


describe('API:USERS tests', () => {

  describe('AUTH:tests', () => {
    it('GET: Should return 401 if no token was provided', async () =>{
      const res = await request(app)
        .get('/user')
      expect(res.status).toEqual(401)
      expect(res.text).toBe('MissingParamError: token')
    })
    it('GET:Should return 401 if invalid token was provided', async () => {
      const res = await request(app)
        .get('/user')
        .query({
          token: 'invalidToken'
        })
      expect(res.status).toEqual(401)
      expect(res.text).toBe('InvalidParamError: token')
    })
    it('POST: Should return 401 if no token was provided', async () =>{
      const res = await request(app)
        .post('/user')
      expect(res.status).toEqual(401)
      expect(res.text).toBe('MissingParamError: token')
    })
    it('POST: Should return 401 if invalid token was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'invalidToken'
        })
      expect(res.status).toEqual(401)
      expect(res.text).toBe('InvalidParamError: token')
    })
    it('POST: Should return 401 if no token was provided', async () =>{
      const res = await request(app)
        .put('/user')
      expect(res.status).toEqual(401)
      expect(res.text).toBe('MissingParamError: token')
    })
    it('POST: Should return 401 if invalid token was provided', async () => {
      const res = await request(app)
        .put('/user')
        .query({
          token: 'invalidToken'
        })
      expect(res.status).toEqual(401)
      expect(res.text).toBe('InvalidParamError: token')
    })
  })

  describe('GET:User route tests', () =>{
    it('Shoud return 200 if valid request was send', async () => {
      const res = await request(app)
        .get('/user')
        .query({
          token: 'validToken'
        })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('users')
    })
  })

  describe('POST:User route tests', () =>{
    it('Should return 400 if no fullName was provided', async () => {
    const res = await request(app)
      .post('/user')
      .query({
        token: 'validToken'
      })
      .send({
        // fullName: 'validFullName',
        username: 'validUsername',
        email: 'validEmail',
        password: 'validPassword',
        passwordConfirmation: 'validPassowdConfirmation',
        manager: true
      })
    expect(res.status).toEqual(400)
    expect(res.text).toBe('MissingParamError: fullName')
    })
    it('Should return 400 if no username was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          // username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: username')
    })
    it('Should return 400 if no email was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          username: 'validUsername',
          // email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: email')
    })
    it('Should return 400 if no password was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          // password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: password')
    })
    it('Should return 400 if no passwordConfirmation was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          // passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: passwordConfirmation')
    })
    it('Should return 400 if no manager rule was provided', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          // manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: manager')
    })
    it('Should return 200 if user created', async () => {
      const res = await request(app)
        .post('/user')
        .query({
          token: 'validToken'
        })
        .send({
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('user')
    })
  })

  describe('PUT:User route tests', () =>{
    it('Should return 400 if no id was provided', async () => {
      const res = await request(app)
        .put('/user')
        .query({
          token: 'validToken'
        })
        .send({
          // id: 'validUserId',
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: id')
    })
    it('Should return 400 if invalid id was provided', async () => {
      const res = await request(app)
        .put('/user')
        .query({
          token: 'validToken'
        })
        .send({
          id: 'invalidUserId',
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('InvalidParamError: id')
    })
    it('Should return 200 if user was updated', async () => {
      const res = await request(app)
        .put('/user')
        .query({
          token: 'validToken'
        })
        .send({
          id: 'validUserId',
          fullName: 'validFullName',
          username: 'validUsername',
          email: 'validEmail',
          password: 'validPassword',
          passwordConfirmation: 'validPassowdConfirmation',
          manager: true
        })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('user')
      expect(res.body.user.id).toEqual('validUserId')
    })
  })

  describe('DELETE:User route tests', () =>{
    it('Should return 400 if no id was provided', async () => {
      const res = await request(app)
        .delete('/user')
        .query({
          token: 'validToken'
        })
        .send({
          // id: 'validUserId',
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: id')
    })
    it('Should return 400 if invalid id was provided', async () => {
      const res = await request(app)
        .delete('/user')
        .query({
          token: 'validToken'
        })
        .send({
          id: 'invalidUserId',
        })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('InvalidParamError: id')
    })
    it('Should return 200 if user was deleted', async () => {
      const res = await request(app)
        .delete('/user')
        .query({
          token: 'validToken'
        })
        .send({
          id: 'validUserId'
        })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('user')
      expect(res.body.user.id).toEqual('validUserId')
    })
  })

  describe('SEARCH:User route tests', () =>{
    it('Should return 400 if no search param was provided', async () => {
      const res = await request(app)
        .get('/search/user')
        .query({
          token: 'validToken'
        })
        // .send({
        //   // id: 'validUserId',
        //   // username: 'validUsername',
        //   // email: 'validEmail'
        // })
      expect(res.status).toEqual(400)
      expect(res.text).toBe('MissingParamError: email, username or id')
    })
    it('Should return 200 if user was find', async () => {
      const res = await request(app)
        .get('/search/user')
        .query({
          token: 'validToken'
        })
        .send({
          id: 'validUserId',
          username: 'validUsername',
          email: 'validEmail'
        })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('user')
    })
  })
})