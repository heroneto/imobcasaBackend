const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const port = process.env.PORT || 8000
const routes = require('../routes')
const cookieParser = require('cookie-parser')
const secret = process.env.JWT_SECRET
const csrf = require('csurf')
const csrfProtection = csrf({
  cookie: true
})
const token = "teste"

const startServer = () => {
  app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  app.get('/rest/api/webhook', (req,res)=>{
    if(req.query['hub.verify_token'] === token){
      const challenge  = req.query['hub.challenge']
      res.send(challenge)
    }
  })
  app.post('/rest/api/webhook', (req,res)=>{  
    console.log(req.header)
    console.log(req.query)
    console.log(req.body)
  })
  app.use(cookieParser(secret))
  app.use(csrfProtection)
  app.use(routes)
  
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Servidor executando na porta ${port}`)
    })
  }
  
  return app
}



module.exports = startServer