const CampaignRepository = require('../repositories/CampaignRepository')
const Service = require("./Service")

class CampaignService extends Service{
  _createRequiredFields = ["name", "active", "fbCreatedDate", "fbCampaignId", "fbAdAccountId"]
  _getOneRequiredFields = ["id"]
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


  
}

module.exports = CampaignService