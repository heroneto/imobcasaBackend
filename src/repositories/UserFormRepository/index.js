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

  async list(fields){
    return await UsersForms.findAll({
      where: {
        formid: fields.formid
      }
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

  async getUserToDistibute(formId){
    return await UsersForms.findOne({
      where: {
        enabled: true,
        formid: formId,
      },
      order: [['lastLeadReceivedTime', 'asc']]
    })
  }
}


module.exports = UserFormRepository