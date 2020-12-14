const { User } = require('../../models')

class Mocks {
    

  mockNext = () => {
    const next = jest.fn()
    return next
  }
  
  mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)
    return res
  };
  
  mockReq = (body = {}, query = {}, params = {}, locals = {}, signedCookies = {}) => {
    return {
      body:body,
      query:query,
      params:params,
      locals:locals,
      signedCookies: signedCookies
    }
  }

  mockUser(admin=true){
    return {
      username: "validUser",
      fullName: "ValidFullName",
      email: "valid@email.com",
      password: "validPassword",
      passwordConfirmation: "validPassword",
      admin: admin,
      active: true,
    }
  }

  async mockJwtToken(id){
    const user = await User.findOne({where: {id: id}})  
    const token = await user.generateToken(user.id, user.admin)
    return token
  }

  mockLead (userid, statusid, sourceId){
    const fakeLead = {
      name: "Fake Lead",
      phone: "0000000000",
      sourceid: sourceId,
      campaignid: null,
      userid: userid,
      active: true,
      statusid: statusid,
      negociationStartedAt: new Date()
    }
    return fakeLead
  }

  mockLeadSource(){
    return {
      name: "Manual",
      active: true,
    }
  }

  mockLeadStatus(){
    return {
      name: 'To do',
      description: 'Represents an item that is in the queue for execution'
    }
  }

  mockCampaign(){
    const fakeCampaign = {
      name: "fakeCampaignName",
      active: true,
      fbCreatedDate: new Date(),
      fbCampaignId: "Fake FB Campaign ID",
      fbAdAccountId: "Fake FB AD Account ID"
    }
    return fakeCampaign
  }
}

module.exports = Mocks