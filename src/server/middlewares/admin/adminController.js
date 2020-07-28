const { invalidParamError, missingParamError } = require('../../controllers/config').errors
const { invalidRequest, forbiden } = require('../../controllers/config').protocols
const User = require('../../models').users
const jwt = require('jsonwebtoken')
const path = require('path')
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
  checkAdminPrivileges: async (req, res) => {
    try{
      const {jwt} = req.signedCookies
      if(!jwt){
        const {error} = missingParamError('jwt')
        const {statusCode, body} = forbiden(error)
        return res.status(statusCode).send(body)
      }
      const userDecoded = await getUserFromToken(jwt)
      const user = await User.findOne({where: {id: userDecoded.id}})
      console.log(user.admin)
      if(!user.admin){
        const {error} = invalidParamError('jwt')
        const {statusCode, body} = forbiden(error)
        return res.status(statusCode).send(body)
      }
      return res.status(200).send('ok')
    }catch(err){
      console.log(err)
    }
  }
}