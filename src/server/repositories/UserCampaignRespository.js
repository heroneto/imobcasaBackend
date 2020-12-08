
const UsersCampaigns = require('../models').usersCampaigns


class UserCampaignResposotory{
  
  
  async add(fields){
    return await UsersCampaigns.create(fields) 
  }

  async remove(fields){
    return await UsersCampaigns.destroy({
      where: {
        campaignid: fields.campaignid,
        userid: fields.userid,
      }
    })
  }

  async getOne(fields){
    return await UsersCampaigns.findOne({
      where: {
        userid: fields.userid,
        campaignid: fields.campaignid
      }
    })
  }

  async list(fields){
    return await UsersCampaigns.findAll({
      where: {
        campaignid: fields.campaignid
      }
    })
  }
}


module.exports = UserCampaignResposotory