import { serverSetup, databaseSetup } from './setup'

async function startApp(){
  await databaseSetup()
  await serverSetup()
}


startApp()
