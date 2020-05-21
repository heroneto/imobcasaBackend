const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, './.env')})
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res) =>{
  res.send('Hello world!')
})

app.post('/rest/api/lead', (req,res) =>{
  console.log(req.body)
  res.send("Tnks")
})

app.listen(port, () => {
  console.log(`Servidor executando na porta ${port}`)
})