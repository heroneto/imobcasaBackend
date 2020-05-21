var express = require('express')
var router = express.Router()



router.get('/', (req,res) =>{
  res.send('Hello world!')
})

router.post('/rest/api/lead', (req,res) =>{
  console.log(req.body)
  res.send("Tnks")
})

router.get('/search/user', (req,res)=>{
  const {id} = req.query
  res.send(`Usuário ${id} localizado`)
})


router.route('/user')
  .all((req,res,next)=>{
    console.log("Validando acesso do usuário")
    const {token} = req.query
    const user = {isValid: token == 123456 ? true : false}
    if(user.isValid){
      next()
    }else{
      res.send("Acesso inválido")
    }
  })
  .get((req,res)=>{
    res.send('todos usuarios')
  })
  
  .post((req,res)=>{
    res.send('criando usuario')
  })
  
  .put((req,res)=>{
    const {id} = req.query
    res.send(`atualizando usuario ${id}`)
  })
  .delete((req,res)=>{
    const {id} = req.query
    res.send(`deletando usuário ${id}`)
  })






module.exports = router