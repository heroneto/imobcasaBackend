const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const port = process.env.PORT || 3000
const routes = require('../src/routes')


const startServer = () => {
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  app.use(routes)
  
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Servidor executando na porta ${port}`)
    })
  }
  
  return app
}



module.exports = startServer