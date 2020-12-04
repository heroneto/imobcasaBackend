var express = require('express')
var router = express.Router()
const { userAuthentication} = require('../../middlewares').auth

router.route('/login')
  .post(userAuthentication)


module.exports = {router}