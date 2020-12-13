const { Lead } = require('../models')
const Sequelize = require('sequelize')
const { Op } = Sequelize


class LeadRepository {


  async getOne(fields) {
    return await Lead.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async list() {    
    return await Lead.findAll()
  }

  async create(fields) {
    return await Lead.create(fields)
  }

  async update(lead, fields) {
    lead.name = fields.name
    lead.phone = fields.phone
    lead.sourceid = fields.sourceid
    lead.campaignid = fields.campaignid
    lead.userid = fields.userid
    lead.active = fields.active
    lead.statusid = fields.statusid
    await lead.save()
    return lead
  }

  async delete(fields) {
    return await Lead.destroy({
      where: {
        id: fields.id,
      }
    })
  }

  async search(fields) {
    return await Lead.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${fields.value}%`
            }
          },
          {
            phone: {
              [Op.like]: `%${fields.value}%`
            }
          }
        ]
      }
    })
  }

  async findByPhone(phone){
    return await Lead.findOne({
      where: {
        phone: phone
      }
    })
  }
}

module.exports = LeadRepository