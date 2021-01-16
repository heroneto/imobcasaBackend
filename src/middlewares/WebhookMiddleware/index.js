const { internalError } = require('../../helpers/protocols')
const { serverError } = require('../../helpers/errors')
const { WebhookService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')

class WebhookMiddleware {

  async checkSignature (req, res, next){
    try{
      const webhookService = new WebhookService()
      await webhookService.checkSignature(req.headers, req.body)
      next()
    }catch(err){     
      if(err instanceof ServiceException){
        const {statusCode, message} = err
        return res.status(statusCode).json(message)
      }else {
        console.error(err)
        const {error} = serverError()
        const {statusCode, body} = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }
}

module.exports = WebhookMiddleware