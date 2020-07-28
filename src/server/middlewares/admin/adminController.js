const { invalidParamError, missingParamError } = require('../../controllers/config').errors
const { invalidRequest, forbiden } = require('../../controllers/config').protocols
const User = require('../../models').users
const jwt = require('jsonwebtoken')
const path = require('path')
const { nextTick } = require('process')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})

async function getUserFromToken(token){
  try{
    const jwtdecoded = await jwt.verify(token, process.env.JWT_SECRET)
    return jwtdecoded
  }catch(err){
    console.log(err)
  }
}


module.exports = {
  checkAdminPrivileges: async (req, res, next) => {
    try{
      const {jwt} = req.signedCookies
      if(!jwt){
        const {error} = missingParamError('jwt')
        const {statusCode, body} = forbiden(error)
        return res.status(statusCode).send(body)
      }
      const userDecoded = await getUserFromToken(jwt)
      const user = await User.findOne({where: {id: userDecoded.id}})
      if(!user.admin){
        const {error} = invalidParamError('jwt')
        const {statusCode, body} = forbiden(error)
        return res.status(statusCode).send(body)
      }
      next()
    }catch(err){
      console.log(err)
    }
  }
}