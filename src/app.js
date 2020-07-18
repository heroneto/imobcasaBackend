const database = require('./database')
const server = require('./server')


async function app(){
  try{
    await database()
    await server()
  }catch(err){
    console.log(err)
  }
}


app()