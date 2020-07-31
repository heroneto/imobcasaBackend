var express = require('express')
var router = express.Router()
const { userAuthentication} = require('../../middlewares').auth

router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
})

router.route('/login')
  .post(userAuthentication)


module.exports = {router}