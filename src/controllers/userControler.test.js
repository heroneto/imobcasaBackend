const { getAllUsers, createUser, updateUser, deleteUser } = require('./userController')
const startDatabase = require('../../setup/database')
const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    admin: true
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

const mockRequest = (body) => {
  const request = {}
  request.body = body
  return request
}

beforeAll(async () => {
  try{
    await startDatabase()
  }catch(err){
    console.log(err.toString())
  }
})

describe('USER CONTROLLER: tests', async () =>{
  it('POST: Should return 400 if no Username has beem send', async() =>{
    const user = mockFakeUser()
    delete user.username
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: username')
  })
  it('POST: Should return 400 if no fullName has beem send', async()=>{
    const user = mockFakeUser()
    delete user.fullName
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: fullName')
  })
  it('POST: Should return 400 if no email has beem send', async()=>{
    const user = mockFakeUser()
    delete user.email
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: email')
  })
  it('POST: Should return 400 if no password has beem send', async()=>{
    const user = mockFakeUser()
    delete user.password
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: password')
  })
  it('POST: Should return 400 if no admin attribute has beem send', async()=>{
    const user = mockFakeUser()
    delete user.admin
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: admin')
  })
  it('POST: Should return 200 if user has been created', async () =>{
    const user = mockFakeUser()
    const res = mockResponse()
    const req = mockRequest(user)
    await createUser(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({user:expect.objectContaining({
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(Number),
      admin: expect.any(Boolean),
      password: expect.any(String),
      updatedAt: expect.any(Date),
      username: expect.any(String),
    })})
  })
  it('GET: Should return 200', async () =>{
    const res = mockResponse()
    const req = mockRequest()
    await getAllUsers(req,res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(Number),
      admin: expect.any(Boolean),
      password: expect.any(String),
      updatedAt: expect.any(Date),
      username: expect.any(String),
    })])
  })
  it('PUT: Should return 400 if no id and username has beem send', async()=>{
    const user = mockFakeUser()
    delete user.username
    const res = mockResponse()
    const req = mockRequest(user)
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: id and username')
  })
  it('PUT: Should return 400 if invalid id and username has beem send', async()=>{
    const user = mockFakeUser()
    user.id = 'invalidId'
    user.username = 'invalidUsername'
    const res = mockResponse()
    const req = mockRequest(user)
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('InvalidParamError: id or username')
  })
  it('PUT: Should return 200 username has beem updated', async()=>{
    const user = mockFakeUser()
    user.id = 1
    const res = mockResponse()
    const req = mockRequest(user)
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toBeCalledWith({user: expect.objectContaining({
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(Number),
      manager: expect.any(Boolean),
      password: expect.any(String),
      updatedAt: expect.any(Date),
      username: expect.any(String),
    })})
  })
  it('DELETE: Should return 400 if no id and username has beem send', async()=>{
    const user = mockFakeUser()
    delete user.id
    delete user.username
    const res = mockResponse()
    const req = mockRequest(user)
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: id and username')
  })
  it('DELETE: Should return 400 if invalid id and username has beem send', async()=>{
    const user = mockFakeUser()
    user.id = 'invalidId'
    user.username = 'invalidUsername'
    const res = mockResponse()
    const req = mockRequest(user)
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('InvalidParamError: id or username')
  })
  it('DELETE: Should return 200 username has beem deleted', async()=>{
    const user = mockFakeUser()
    user.id = 1
    const res = mockResponse()
    const req = mockRequest(user)
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toBeCalledWith({user: expect.objectContaining({
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(Number),
      manager: expect.any(Boolean),
      password: expect.any(String),
      updatedAt: expect.any(Date),
      username: expect.any(String),
    })})
  })
})
