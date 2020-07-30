var express = require('express')
var router = express.Router()
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers').user
const { searchUser } = require('../controllers').search
const { searchLeads, getLead, getAllLeads, createLead, updateLead, deleteLead } = require('../controllers').leads
const { createTask, getTask, updateTask, deleteTask, searchTask, getAllTasks } = require('../controllers').tasks
const { checkAuthentication, userAuthentication} = require('../middlewares').auth
const { checkAdminPrivileges } = require('../middlewares').admin

router.get('/', (req,res) =>{
  res.send('Hello world!')
})

router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
})

router.route('/login')
  .post(userAuthentication)


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


//Lead routes
router.route('/lead')
  .all(checkAuthentication)
  .get(getLead)
  .post(createLead)
  .put(updateLead)
  .delete(deleteLead)

router.route('/leads')
  .all(checkAuthentication)
  .all(checkAdminPrivileges)
  .get(getAllLeads) 

router.route('/lead/search')
  .all(checkAuthentication)
  .get(searchLeads)


//Task routes
router.route('/task')
  .all(checkAuthentication)
  .get(getTask)
  .post(createTask)
  .put(updateTask)
  .delete(deleteTask)

router.route('/task/search')
  .all(checkAuthentication)
  .get(searchTask)

router.route('/tasks')
  .all(checkAuthentication)
  .get(getAllTasks)

module.exports = router