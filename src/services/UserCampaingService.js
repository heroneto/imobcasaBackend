const Service = require('./Service')
const UserCampaignRespository = require('../repositories/UserCampaignRespository')
const UserRepository = require('../repositories/UserRepository')
const CampaignRespository = require('../repositories/CampaignRepository')

class UserCampaingService extends Service{
  _requiredFields = ["userid", "campaignid"]  
  _listRequiredFields = ["campaignid"]
  _enableRequiredFields = ["userid", "campaignid"]  

  constructor(){
    super()
    this._userCampaignRespository = new UserCampaignRespository()
    this._userRespository = new UserRepository()
    this._campaignRespository = new CampaignRespository()
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

    const campaign = await this._campaignRespository.getOne({
      id: fields.campaignid
    })
    await this._checkEntityExsits(campaign, "campaignid")
    
    const usercampaign = await this._userCampaignRespository.getOne(fields)
    await this._checkUserExistsInCampaign(usercampaign)
    
    return await this._userCampaignRespository.add(fields)
  }

  async remove(fields){    
    await this._checkRequiredFields(this._requiredFields, fields)
    const { userid, campaignid } = fields
    return await this._userCampaignRespository.remove({ userid, campaignid })
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    return await this._userCampaignRespository.list(fields)
  }

  async enable(fields){
    await this._checkRequiredFields(this._enableRequiredFields, fields)
    const { userid, campaignid } = fields
    const userCampaignReg = await this._userCampaignRespository.getOne({
      userid,
      campaignid
    })
    await this._checkEntityExsits(userCampaignReg, 'userid or campaignid')
    return await this._userCampaignRespository.enable(userCampaignReg)

  }

}

module.exports = UserCampaingService