

class ModelsExpected {

  userModel(){
    return {
      active: expect.any(Boolean),
      createdAt: expect.any(Date),
      email: expect.any(String),
      fullName: expect.any(String),
      id: expect.any(String),
      admin: expect.any(Boolean),
      updatedAt: expect.any(Date),
      username: expect.any(String),
    }
  }

  userCampaignModel(){
    return {
      id: expect.any(String),
      campaignid: expect.any(String),
      userid: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt:expect.any(Date)
    }
  }

  campaignModel() {
    return {
      id: expect.any(String),
      name: expect.any(String),
      active: expect.any(Boolean),
      fbCreatedDate: expect.any(Date),
      fbCampaignId: expect.any(String),
      fbAdAccountId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt:expect.any(Date)
    }
  }

  leadModel(){
    return {
      id: expect.any(String),
      name: expect.any(String),
      phone: expect.any(String),
      sourceid: expect.any(String),
      campaignid: null,
      userid: expect.any(String),
      active: expect.any(Boolean),
      statusid: expect.any(String),
      negociationStartedAt: expect.any(Date),
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date)
    }
  }

}


module.exports = ModelsExpected