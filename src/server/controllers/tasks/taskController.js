const { Router } = require('express')
const TaskService = require('../../services/TaskService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const AuthenticationMiddleware = require('../../middlewares/authentication')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors


class TaskController {
  routes = Router()
  basePath = "/users"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search`

  constructor(){
    this.authenticationMid = new AuthenticationMiddleware()
    this._load()
  }


  async _load() {
    // this.routes.route(this.basePath)
    //   .all(this.authenticationMid.checkAuthentication)
    //   .all(this.authorizationMid.checkAdminPrivileges)
    //   .get(this._list)
    //   .post(this._create)
    //   .put(this._update)
    //   .delete(this._delete)

    // this.routes.route(this.getOnePath)
    //   .all(this.authenticationMid.checkAuthentication)
    //   .all(this.authorizationMid.checkAdminPrivileges)     
    //   .get(this._getOne)

    // this.routes.route(this.searchPath)
    //   .all(this.authenticationMid.checkAuthentication)
    //   .all(this.authorizationMid.checkAdminPrivileges)
    //   .get(this._search)
  }


  async _create(req,res){
    try {
      const taskService = new TaskService()
      const user = await taskService._create({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(user)
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
      const user = await taskService._getOne({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(user)
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

  async _list(req,res){
    try {
      const taskService = new TaskService()
      const user = await taskService._list({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(user)
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
      const user = await taskService._delete({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(user)
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
      const user = await taskService._update({
        ...req.params,
        ...req.locals
      })
      return res.status(200).json(user)
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