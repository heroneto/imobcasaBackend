const { LeadSource } = require('../../models')


class LeadSourceRepository {

  async getOne(fields){    
    return await LeadSource.findOne({
      where: {
        id: fields.id
      }
    })
  }

}

module.exports = LeadSourceRepository