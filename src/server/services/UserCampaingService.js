const Service = require('./Service')
const UserCampaignRespository = require('../repositories/UserCampaignRespository')


class UserCampaingService extends Service{
  _requiredFields = ["userid", "campaignid"]  
  _listRequiredFields = ["campaignid"]

  constructor(){
    super()
    this._userCampaignRespository = new UserCampaignRespository()
  }

  
  _checkUserExistsInCampaign(entity){
    if(entity){
      this._throwException("User already exists in this campaign", 400)
    }
  }

  async add(fields){
    await this._checkRequiredFields(this._requiredFields, fields)
    const usercampaign = await this._userCampaignRespository.getOne(fields)
    await this._checkUserExistsInCampaign(usercampaign)
    return await this._userCampaignRespository.add(fields)
  }

  async remove(fields){
    await this._checkRequiredFields(this._requiredFields, fields)
    return await this._userCampaignRespository.remove(fields)
  }

  async list(fields){
    await this._checkRequiredFields(this._listRequiredFields, fields)
    return await this._userCampaignRespository.list(fields)
  }


}

module.exports = UserCampaingService