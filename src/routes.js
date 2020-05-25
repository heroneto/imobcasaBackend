var express = require('express')
var router = express.Router()
const {forbiden, invalidRequest, unauthorized} = require('./protocols/httpCodes')
const {invalidParamError, missingParamError} = require('./Errors/')

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


router.get('/', (req,res) =>{
  res.send('Hello world!')
})

router.post('/rest/api/lead', (req,res) =>{
  console.log(req.body)
  res.send("Tnks")
})


router.route('/search/user')
  .all((req,res,next)=>{
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
  })
  .get((req,res)=>{
    try{
      const {id, username, email} = req.body
      if(!email && !id && !username){
        const {error} = missingParamError('email, username or id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      res.status(200).send({user: ''})
    }catch(error){
      console.log(error)
    }
  
})




router.route('/user')
  .all((req,res,next)=>{
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
  })
  .get((req,res)=>{
    res.status(200).send({users: ''})
  })  
  .post((req,res)=>{
    const requiredFields = ['fullName', 'username', 'email', 'password', 'passwordConfirmation', 'manager']
    for(const field of requiredFields){
      if(!req.body[`${field}`]){
        const {error} = missingParamError(field)
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
    }
    res.status(200).send({user: ''})
  })
  .put((req,res)=>{
    const {id, ...rest} = req.body
    if(!id){
      const {error} = missingParamError('id')
      const {statusCode, body} = invalidRequest(error)
      return res.status(statusCode).send(body)
    }
    const user = {
      id,
      ...rest
    }    
    res.status(200).send({user})
  })
  .delete((req,res)=>{
    const {id} = req.body
    if(!id){
      const {error} = missingParamError('id')
      const {statusCode, body} = invalidRequest(error)
      return res.status(statusCode).send(body)
    }
    const user = {
      id
    }
    res.status(200).send({user})
  })


module.exports = router