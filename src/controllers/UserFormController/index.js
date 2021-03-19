const { Router } = require('express')
const { UserFormService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')

class UserFormController{
  path = "/forms/:formid/user/:userid"
  listPath = "/forms/:formid/users"  
  routes = Router()
  constructor() {
    this.load()
  }

  load() {
    this.routes.get(this.listPath, this.list)
    this.routes.post(this.path, this.add)
    this.routes.delete(this.path, this.remove)
    this.routes.put(this.path, this.update)
    this.routes.put(`${this.path}/enable`, this.enable)
    this.routes.put(`${this.path}/disable`, this.disable)
  }

  async list(request, response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.list(request.params)
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async add(request,response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.add(request.params)
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async remove(request,response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.remove(request.params)
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async update(request,response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.update({
        ...request.params,
        ...request.body
      })
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async enable(request, response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.enable(request.params)
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async disable(request, response){
    try {
      const userFormService = new UserFormService()
      const result = await userFormService.disable(request.params)
      return response.status(200).json(result)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }
}

module.exports = UserFormController