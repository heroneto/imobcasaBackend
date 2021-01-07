const { Router } = require('express')
const { TaskService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { AuthenticationMiddleware } = require('../../middlewares')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')


class TaskController {
  routes = Router()
  basePath = "/tasks"

  constructor(){
    this.authenticationMid = new AuthenticationMiddleware()
    this._load()
  }


  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .post(this._create)
    
    this.routes.route(`${this.basePath}/leads/:leadid`)
      .all(this.authenticationMid.checkAuthentication)
      .get(this._listByLead)

    this.routes.route(`${this.basePath}/:id`)
      .all(this.authenticationMid.checkAuthentication)
      .get(this._getOne)
  }


  async _create(req,res){
    try {
      const taskService = new TaskService()
      const task = await taskService.create({
        ...req.body,
        ...req.locals
      })
      return res.status(200).json(task)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }

  async _listByLead(req,res){
    try {
      const taskService = new TaskService()
      const tasks = await taskService.listByLead({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(tasks)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }


  async _getOne(req,res){
    try {
      const taskService = new TaskService()
      const task = await taskService.getOne({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(task)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }

  async _delete(req,res){
    try {
      const taskService = new TaskService()
      const result = await taskService.delete({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }

  async _update(req,res){
    try {
      const taskService = new TaskService()
      const task = await taskService.update({
        ...req.body,
        ...req.locals
      })
      return res.status(200).json(task)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }
}

module.exports = TaskController