const { Lead } = require('../../models')
const Sequelize = require('sequelize')
const { Op } = Sequelize


class LeadRepository {


  async getOne(fields, raw = true) {
    return await Lead.findOne({
      where: {
        id: fields.id
      },
      raw: raw
    })
  }

  async list({skip, limit, statusId}) {
    return await Lead.findAll({
      offset: skip,
      limit: limit,   
      raw: true      
    })
  }

  async listByStatus({skip, limit, statusId}){
    return await Lead.findAll({
      offset: skip,
      limit: limit,
      where: {
        statusId: statusId
      },
      raw: true
    })
  }

  async create(fields) {
    return await Lead.create(fields)
  }

  async update(lead, fields) {
    lead.name = fields.name
    lead.phone = fields.phone
    lead.sourceid = fields.sourceid
    lead.formid = fields.formid
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
      },
      raw: true
    })
  }

  async findByPhone(phone){
    return await Lead.findOne({
      where: {
        phone: phone
      },
      raw: true
    })
  }

  async findOrCreateLead(fields){
    return await Lead.findOrCreate({
      where: {
        phone: fields.phone
      },
      defaults: fields      
    })
  }
}

module.exports = LeadRepository