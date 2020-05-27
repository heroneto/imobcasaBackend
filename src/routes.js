var express = require('express')
var router = express.Router()
const {forbiden, invalidRequest, unauthorized, internalError} = require('./protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('./Errors/')
const {createUser, getAllUsers, updateUser, deleteUser} = require('./controllers/userController')
const {searchUser} = require('./controllers/searchController')
const {checkAuthentication, userAuthentication} = require('./controllers/authController')

router.get('/', (req,res) =>{
  res.send('Hello world!')
})

router.post('/rest/api/lead', (req,res) =>{
  console.log(req.body)
  res.send("Tnks")
})

router.route('/login')
  .post(userAuthentication)

router.route('/search/user')
  .all(checkAuthentication)
  .get(searchUser)

router.route('/user')
  .all(checkAuthentication)
  .get(getAllUsers)  
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser)


module.exports = router