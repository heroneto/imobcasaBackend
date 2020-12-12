const Leads = require('../models').lead
const Sequelize = require('sequelize')
const { Op } = Sequelize


class LeadRepository {


  async getOne(fields) {
    return await Leads.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async list() {    
    return await Leads.findAll()
  }

  async create(fields) {
    return await Leads.create(fields)
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
    return await Leads.destroy({
      where: {
        id: fields.id,
        userid: fields.userid
      }
    })
  }

  async search(fields) {
    return await Leads.findAll({
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
    return await Leads.findOne({
      where: {
        phone: phone
      }
    })
  }
}

module.exports = LeadRepository