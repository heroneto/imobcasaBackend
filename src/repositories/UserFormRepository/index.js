const { UsersForms, Form } = require('../../models')


class UserFormRepository{
  
  
  async add(fields){
    return await UsersForms.create(fields) 
  }

  async remove(fields){
    return await UsersForms.destroy({
      where: {
        formid: fields.formid,
        userid: fields.userid,
      }
    })
  }

  async getOne(fields){
    return await UsersForms.findOne({
      where: {
        userid: fields.userid,
        formid: fields.formid
      }
    })
  }

  async list(formid){
    return await UsersForms.findAll({
      where: {
        formid: formid
      },
      raw: true
    })
  }

  async enable(userForm){
    return await userForm.update({
      enabled: true
    })
  }

  async disable(userForm){
    return await userForm.update({
      enabled: false
    })
  }

  async update(userForm, fields){
    userForm.enabled = fields.enabled
    userForm.lastLeadReceivedTime = fields.lastLeadReceivedTime
    userForm.score = fields.score
    return await userForm.save()
  }

  async getActiveUserToDistibute(formId){
    return await UsersForms.findOne({
      where: {
        enabled: true,
        formid: formId,
      },
      order: [['lastLeadReceivedTime', 'asc']]
    })
  }
  async getInactiveUserToDistibute(formId){
    return await UsersForms.findOne({
      where: {
        enabled: false,
        formid: formId,
      },
      order: [['lastLeadReceivedTime', 'asc']]
    })
  }
  async updateLastLeadReceivedTime(userForm){
    return await userForm.update({
      lastLeadReceivedTime: Date.now()
    })
  }
}


module.exports = UserFormRepository