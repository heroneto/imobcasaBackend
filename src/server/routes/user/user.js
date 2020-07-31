var express = require('express')
var router = express.Router()
const { createUser, getAllUsers, updateUser, deleteUser } = require('../../controllers').user
const { searchUser } = require('../../controllers').search
const { checkAuthentication } = require('../../middlewares').auth
const { checkAdminPrivileges } = require('../../middlewares').admin

//User routes
router.route('/user/search')
  .all(checkAuthentication)
  .get(searchUser)

router.route('/user')
  .all(checkAuthentication)
  .all(checkAdminPrivileges)  
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser)

router.route('/users')
  .all(checkAuthentication)
  .all(checkAdminPrivileges)
  .get(getAllUsers)  

module.exports = {router}