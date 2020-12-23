const { LeadStatus } = require('../models')


class LeadStatusRepository {

  async getOne(fields){    
    return await LeadStatus.findOne({
      where: {
        id: fields.id
      }
    })
  }

}

module.exports = LeadStatusRepository