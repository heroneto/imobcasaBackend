var express = require('express')
var router = express.Router()
const { createTask, getTask, updateTask, deleteTask, searchTask, getAllTasks } = require('../../controllers').tasks
const { checkAuthentication } = require('../../middlewares').auth

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

module.exports = {router}