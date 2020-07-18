var express = require('express')
var router = express.Router()
const {createUser, getAllUsers, updateUser, deleteUser} = require('../controllers').user
const {searchUser} = require('../controllers').search
const {checkAuthentication, userAuthentication} = require('../middlewares').auth

router.get('/', (req,res) =>{
  res.send('Hello world!')
})

router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
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

router.route('/lead')
  .all(checkAuthentication)
  .get()
  .post()
  .put()
  .delete()

module.exports = router