const { CampaignRepository }  = require('../repositories/CampaignRepository')
const Service = require("./Service")

class CampaignService extends Service{
  _createRequiredFields = ["name", "active", "fbCreatedDate", "fbCampaignId", "fbAdAccountId"]

  constructor(){
    super()
    this._campaignRepository = new CampaignRepository()
  }

  async create(fields){
    await this._checkRequiredFields(this._createRequiredFields, fields)
    return true
  }


  
}

module.exports = CampaignService