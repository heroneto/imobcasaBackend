var express = require('express')
var router = express.Router()
const { createTaskType, deleteTaskType, updateTaskType, getAllTaskTypes, getTaskType } = require('../../controllers').taskType
const { checkAuthentication } = require('../../middlewares').auth
const { checkAdminPrivileges } = require('../../middlewares').admin

router.route('/task/type')
  .all(checkAuthentication)
  .all(checkAdminPrivileges)  
  .post(createTaskType)
  .put(updateTaskType)
  .delete(deleteTaskType)
  .get(getTaskType)

router.route('/task/types')
  .all(checkAuthentication)
  .all(checkAdminPrivileges)
  .get(getAllTaskTypes)  

module.exports = {router}