const { Router } = require('express')
const UserService = require('../../services/UserService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors


class UserController {
  routes = Router()
  basePath = "/users"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search`

  constructor() {
    this._load()
  }


  async _load() {
    this.routes.get(this.basePath, this._list)
    this.routes.post(this.basePath, this._create)
    this.routes.put(this.basePath, this._update)
    this.routes.delete(this.basePath, this._delete)
    this.routes.get(this.getOnePath, this._getOne)
    this.routes.get(this.searchPath, this._search)
  }

  async _getOne(req, res) {
    try {
      const userService = new UserService()
      const user = await userService.getUser(req.query)
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
      const result = await userService.deleteUser(req.body)
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