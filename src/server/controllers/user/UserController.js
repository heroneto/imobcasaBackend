const { Router } = require('express')
const UserService = require('../../services/UserService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const AuthenticationMiddleware = require('../../middlewares/authentication')
const AuthorizationMiddleware = require('../../middlewares/authorization')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors


class UserController {
  routes = Router()
  basePath = "/users"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search`

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.authorizationMid = new AuthorizationMiddleware()
    this._load()
  }


  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this._list)
      .post(this._create)
      .put(this._update)
      .delete(this._delete)

    this.routes.route(this.getOnePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)     
      .get(this._getOne)

    this.routes.route(this.searchPath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this._search)

  }

  async _getOne(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.getUser(req.params)
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

  async _create(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.createUser(req.body)
      delete user.password
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

  async _list(req, res) {
    try {
      const userService = new UserService()
      const users = await userService.findAll()
      return res.status(200).json(users)
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

  async _update(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.updateUser(req.body)

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

  async _delete(req, res) {
    try {
      const userService = new UserService()
      const result = await userService.deleteUser(req.params)
      res.status(200).json(result)
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

  async _search(req, res) {
    try {
      console.log("teste")
    } catch (error) {

    }
  }

}


module.exports = UserController