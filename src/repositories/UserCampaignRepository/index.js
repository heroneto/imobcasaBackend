const { Userscampaigns } = require('../../models')


class UserCampaignResposotory{
  
  
  async add(fields){
    return await Userscampaigns.create(fields) 
  }

  async remove(fields){
    return await Userscampaigns.destroy({
      where: {
        campaignid: fields.campaignid,
        userid: fields.userid,
      }
    })
  }

  async getOne(fields){
    return await Userscampaigns.findOne({
      where: {
        userid: fields.userid,
        campaignid: fields.campaignid
      }
    })
  }

  async list(fields){
    return await Userscampaigns.findAll({
      where: {
        campaignid: fields.campaignid
      }
    })
  }

  async enable(userCampaign){
    return await userCampaign.update({
      enabled: true
    })
  }

  async disable(userCampaign){
    return await userCampaign.update({
      enabled: false
    })
  }

  async update(userCampaign, fields){
    userCampaign.enabled = fields.enabled
    userCampaign.lastLeadReceivedTime = fields.lastLeadReceivedTime
    userCampaign.score = fields.score
    return await userCampaign.save()
  }

}


module.exports = UserCampaignResposotory