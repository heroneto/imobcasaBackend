const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const port = process.env.PORT || 3000
const routes = require('../src/routes')
const cookieParser = require('cookie-parser')
const secret = process.env.JWT_SECRET
const csrf = require('csurf')

const startServer = () => {
  app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
  const csrfProtection = csrf({
    cookie: true
  })
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
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