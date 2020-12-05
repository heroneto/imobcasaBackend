const { Router }  = require('express')
import { Controller } from '../generic'
const UserService = require('../../services/UserService')

class userController extends Controller {
  basePath = "/campaigns"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search`
  routes = Router()
  constructor(){
    super()
    this._load()
  }

  
  async _load(){
    this.routes.get(this.path, this._list)   
    this.routes.post(this.path, this._create)
    this.routes.put(this.path, this._update)
    this.routes.delete(this.path, this._delete)
    this.routes.get(this.getOnePath, this._getOne)
    this.routes._search(this.searchPath, this._search)
    
  }
  

  async _getOne(request, response){
    try{
      console.log("teste")
    }catch(error){
      if(error instanceof this._ServiceException){
        const {statusCode, message} = err
        return res.status(statusCode).json(message)
      }else {
        this._throwInternalError(response)
      }   
    }
  }

  async _create(request, response){
    try{

    }catch(error){

    }
  }

  async _list(request, response){
    try{

    }catch(error){

    }
  }

  async _update(request, response){
    try{

    }catch(error){

    }
  }

  async _delete(request, response){
    try{

    }catch(error){

    }
  }

  async _search(request, response){
    try{

    }catch(error){

    }
  }



}