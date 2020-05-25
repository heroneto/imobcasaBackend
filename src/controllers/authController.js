const {forbiden, invalidRequest, unauthorized, internalError} = require('../protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')


function authTest(username, password){
  const dbUser = "heron"
  const dbPasword = "12345"
  if(dbUser == username && dbPasword == password){
    return true
  }else{
    return false
  }
}

function checkToken(token){
  if(token === 'validToken'){
    return true
  }else{
    return false
  }
}

module.exports = {
  authUser: (req,res,next)=>{
    try{
      const {token} = req.query
      if(!token){
        const {error} = missingParamError('token')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      const isAuthenticated = checkToken(token)
      if(!isAuthenticated){
        const {error} = invalidParamError('token')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      next()
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }
  }
}