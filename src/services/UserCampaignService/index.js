const Service = require('../Service')
const {
  UserCampaignRepository,
  CampaignRepository,
  UserRepository
} = require('../../repositories')


class UserCampaingService extends Service{
  _requiredFields = ["userid", "campaignid"]  
  _listRequiredFields = ["campaignid"]
  _enableRequiredFields = ["userid", "campaignid"]  
  _disableRequiredFields = ["userid", "campaignid"]
  _updateRequiredFields = ["userid", "campaignid", "score", "enabled", "lastLeadReceivedTime"]

  constructor(){
    super()
    this._userCampaignRepository = new UserCampaignRepository()
    this._userRespository = new UserRepository()
    this._campaignRepository = new CampaignRepository()
  }

  
  _checkUserExistsInCampaign(entity){
    if(entity){
      this._throwException("User already exists in this campaign", 400)
    }
  }

  async add(fields){
    await this._checkRequiredFields(this._requiredFields, fields)

    const user = await this._userRespository.getOne({
      id: fields.userid
    })
    await this._checkEntityExsits(user, "userid")

    const campaign = await this._campaignRepository.getOne({
      id: fields.campaignid
    })
    await this._checkEntityExsits(campaign, "campaignid")
    
    const usercampaign = await this._userCampaignRepository.getOne(fields)
    await this._checkUserExistsInCampaign(usercampaign)
    
    return await this._userCampaignRepository.add(fields)
  }

  async remove(fields){    
    await this._checkRequiredFields(this._requiredFields, fields)
    const { userid, campaignid } = fields
    return await this._userCampaignRepository.remove({ userid, campaignid })
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    return await this._userCampaignRepository.list(fields)
  }

  async enable(fields){
    await this._checkRequiredFields(this._enableRequiredFields, fields)
    const { userid, campaignid } = fields
    const userCampaignReg = await this._userCampaignRepository.getOne({
      userid,
      campaignid
    })
    await this._checkEntityExsits(userCampaignReg, 'userid or campaignid')
    return await this._userCampaignRepository.enable(userCampaignReg)

  }

  async disable(fields){
    await this._checkRequiredFields(this._disableRequiredFields, fields)
    const { userid, campaignid } = fields
    const userCampaignReg = await this._userCampaignRepository.getOne({
      userid,
      campaignid
    })
    await this._checkEntityExsits(userCampaignReg, 'userid or campaignid')
    return await this._userCampaignRepository.disable(userCampaignReg)
  }

  async update(fields){
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const { userid, campaignid, lastLeadReceivedTime, score, enabled } = fields
    const userCampaignReg = await this._userCampaignRepository.getOne({
      userid,
      campaignid
    })
    await this._checkEntityExsits(userCampaignReg, 'userid or campaignid')

    return await this._userCampaignRepository.update(userCampaignReg, {
      lastLeadReceivedTime,
      score,
      enabled
    })
  }

}

module.exports = UserCampaingService