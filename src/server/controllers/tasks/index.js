module.exports = {
  createTask: require('./taskController').createTask,
  deleteTask: require('./taskController').deleteTask,
  getTask: require('./taskController').getTask,
  updateTask: require('./taskController').updateTask,
  searchTask: require('./taskController').searchTasks,
  getAllTasks: require('./taskController').getAllTasks
}

