// const express = require('express')
// const cors = require('cors')
// const path = require('path')
// require('dotenv').config({path: path.resolve(__dirname, '../.env')})
// const { authRoutes, leadRoutes, taskRoutes, userRoutes, tasktypeRoutes } = require('./routes')
// const cookieParser = require('cookie-parser')

// const app = express()
// const port = process.env.PORT || 8000
// const secret = process.env.JWT_SECRET
// const token = "teste"

// async function server(){
//   app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
//   app.use(express.json())
//   app.use(express.urlencoded({extended: true}))

//   app.get('/rest/api/webhook', (req,res)=>{
//     if(req.query['hub.verify_token'] === token){
//       const challenge  = req.query['hub.challenge']
//       res.send(challenge)
//     }
//   })
//   app.post('/rest/api/webhook', (req,res)=>{  
//     console.log(req.header)
//     console.log(req.query)
//     console.log(req.body)
//   })
//   app.use(cookieParser(secret))
//   app.use(leadRoutes)
//   app.use(userRoutes)
//   app.use(taskRoutes)
//   app.use(authRoutes)
//   app.use(tasktypeRoutes)
//   if (process.env.NODE_ENV !== 'test') {
//     app.listen(port, () => {
//       console.log(`Servidor executando na porta ${port}`)
//     })
//   }
  
//   return app
// }

// module.exports = server


const Server = require('./Server')
const CampaignController = require('./controllers/campaign/campaignController')
const UserController = require('./controllers/user/UserController')

async function startServer(){ 
  try{
       
    const server = new Server([
      new CampaignController(),
      new UserController()
    ])
  
    await server.listen()
  }catch(error){
    console.error(error)
  }

}

module.exports = startServer