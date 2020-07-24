const tasktypeModel = require('../../models').tasktype
const { invalidParamError, missingParamError, missingBodyContent } = require('../config').errors
const { internalError, invalidRequest } = require('../config').protocols

module.exports = {
    createTaskType: async (req,res) => {
      try{
        const requiredFields = ['name', 'description', 'active']
        for(const field of requiredFields){
            if(!req.body[`${field}`]){
              const {error} = missingParamError(field)
              const {statusCode, body} = invalidRequest(error)
              return res.status(statusCode).send(body)
            }
        }
        const tasktype = await tasktypeModel.create(req.body)
        return res.status(200).send(tasktype)
      }catch(err){
          const { statusCode, body } = internalError(err)
          return res.status(statusCode).send(body)
      }
    },
    getTaskType: async (req,res) => {
      try{
        const {id} = req.query
        if(!id){
          const {error} = missingParamError('id')
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
        const tasktype = await tasktypeModel.findOne({where: {
          id: id
        }})
        return res.status(200).send(tasktype)
      }catch(err){
        console.log(err)
        const { statusCode, body } = internalError(err)
        return res.status(statusCode).send(body)
      }
    },
    updateTaskType: async (req,res) => {
      try{
        const { id } = req.query
        if(!id){
          const {error} = missingParamError('id')
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
        const requiredFields = ['name', 'description', 'active']
        for(const field of requiredFields){
            if(!req.body[`${field}`]){
              const {error} = missingParamError(field)
              const {statusCode, body} = invalidRequest(error)
              return res.status(statusCode).send(body)
            }
        }
        const {name, description, active } = req.body
        const tasktype = await tasktypeModel.findOne({where:{id:id}})
        tasktype.name = name
        tasktype.description = description
        tasktype.active = active
        tasktype.updatedAt = new Date()
        await tasktype.save()
        return res.status(200).send(tasktype)
      }catch(err){
        console.log(err)
        const { statusCode, body } = internalError(err)
        return res.status(statusCode).send(body)
      }
    },
    deleteTaskType: async (req,res) => {
      try{
        const { id } = req.query
        if(!id){
          const {error} = missingParamError('id')
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
        return res.status(200).send('ok')
      }catch(err){

      }
    }
}