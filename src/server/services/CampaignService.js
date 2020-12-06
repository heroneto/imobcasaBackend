const CampaignRepository = require('../repositories/CampaignRepository')
const Service = require("./Service")

class CampaignService extends Service{
  _createRequiredFields = ["name", "active", "fbCreatedDate", "fbCampaignId", "fbAdAccountId"]
  _getOneRequiredFields = ["id"]
  _changeStateRequiredFields = ["id"]
  constructor(){
    super()
    this._campaignRepository = new CampaignRepository()
  }

  async create(fields){
    await this._checkRequiredFields(this._createRequiredFields, fields)
    return await this._campaignRepository.create(fields)
  }

  async list(){
    return await this._campaignRepository.list()
  }

  async getOne(fields){
    await this._checkRequiredFields(this._getOneRequiredFields, fields)
    const campaign = await this._campaignRepository.getOne(fields)
    this._checkEntityExsits(campaign)
    return campaign
  }

  async inactivate(fields){
    await this._checkRequiredFields(this._changeStateRequiredFields, fields)
    return await this._campaignRepository.inactivate(fields)
  }
  async activate(fields){
    await this._checkRequiredFields(this._changeStateRequiredFields, fields)
    return await this._campaignRepository.activate(fields)
  }
  
}

module.exports = CampaignService