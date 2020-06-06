const { searchUser } = require('./searchController')
const { noResultsError } = require('../Errors/no-result-errors')
const User = require('../models/').User

const mockFakeUser = () => {
  const fakeUser = {
    username: "validUser",
    fullName: "ValidFullName",
    email: "valid@email.com",
    password: "validPassword",
    passwordConfirmation: "validPassword",
    manager: true
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
    const fakeUser = mockFakeUser()
    await User.create(fakeUser)
  }catch(err){
    throw Error(err)
  }
})

afterAll(async () => {
  try{
    const fakeUser = mockFakeUser()
    await User.destroy({where: {
      username: fakeUser.username
    }})
  }catch(err){
    throw Error(err)
  }
})

describe('SEARCH CONTROLLER: tests', async() => {
  it('Should return error 400 if no required Fields has beem send', async () => {
    const fakeUser = mockFakeUser()
    const res = mockResponse()
    const req = mockRequest({})
    await searchUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toBeCalledWith('MissingParamError: email, username or id')
  })
  it('Should return 200 if no users has been found', async () => {
    const fakeUser = mockFakeUser()
    fakeUser.username = 'InvalidUsername'
    fakeUser.id = 'invalidId'
    fakeUser.email = 'invalidEmail'
    const res = mockResponse()
    const req = mockRequest(fakeUser)
    await searchUser(req, res)
    const { error } = noResultsError('no users found')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(error)
  })
})