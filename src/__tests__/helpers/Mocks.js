const { User } = require('../../models')
const JwtImplementation = require('../../implementations/jwt')
const crypto = require('crypto')
class Mocks {


  mockLeadPaginationQuery = (skip = 0, limit = 10, statusId) => {
    return {
      skip,
      limit,
      statusId
    }
  }

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

  mockReq = (body = {}, query = {}, params = {}, locals = {}, headers = {}) => {
    return {
      body: body,
      query: query,
      params: params,
      locals: locals,
      headers: headers      
    }
  }

  mockUser(admin = true) {
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

  async mockJwtToken(id) {
    const jwtImplementation = new JwtImplementation()
    const user = await User.findOne({ where: { id: id } })
    return await jwtImplementation.generateAccessToken(user.id, user.admin)
  }

  async mockRefreshToken(id) {
    const jwtImplementation = new JwtImplementation()
    const user = await User.findOne({ where: { id: id } })
    return await jwtImplementation.generateRefreshToken(user.id, user.admin)
  }

  mockLead(userid, statusid, sourceId, campaignid = null, phone = (Math.round(Math.random() * 100000000000).toString())) {
    const fakeLead = {
      name: "Fake Lead",
      phone,
      sourceid: sourceId,
      campaignid: campaignid,
      userid: userid,
      active: true,
      statusid: statusid,
      negociationStartedAt: new Date()
    }
    return fakeLead
  }

  mockUsersCampaings(userid, campaignid){
    return {
      userid,
      campaignid
    }
  }

  mockLeadSource() {
    return {
      name: "Manual",
      active: true,
    }
  }

  mockLeadStatus(name = "To do", description = 'Represents an item that is in the queue for execution') {
    return [
      {
        name: 'To do',
        description: 'Represents an item that is in the queue for execution'
      },
      {
        name: 'Negociação em andamento',
        description: 'A negocaiação deste Lead está em andamento',
      },
      {
        name: 'Negociação concluída',
        description: 'A negociação deste Lead foi concluída com sucesso',
      },
      {
        name: 'Arquivado',
        description: 'Este Lead está arquivado.',
      }
    ]
  }

  mockCampaign() {
    const fakeCampaign = {
      name: "fakeCampaignName",
      active: true,
      fbCreatedDate: new Date(),
      fbCampaignId: "Fake FB Campaign ID",
      fbAdAccountId: "Fake FB AD Account ID"
    }
    return fakeCampaign
  }

  mockTask(userid, leadid, tasktypeid) {
    return {
      title: "Mocked Task Title",
      description: "Mocked Task Description",
      userid: userid,
      leadid: leadid,
      active: true,
      startdate: new Date().toISOString(),
      tasktypeid: tasktypeid
    }
  }

  mockTaskType() {
    return {
      name: 'Cobrar cliente',
      description: 'Cobrar o cliente referente à uma atualização',
      active: 1
    }
  }

  mockSubscriveRequest(hubmode = 'subscrive', verifyToken = process.env.FB_SUB_TOKEN, hubChallenge = "challengeSecret"){
    return {
      'hub.mode': hubmode,
      'hub.verify_token': verifyToken,
      'hub.challenge': hubChallenge,
    }
  }

  mockXHubSignature(body, appSecret = process.env.FB_APP_SECRET_KEY){
    const payload = JSON.stringify(body)
    const hmac = crypto.createHmac('sha1', appSecret)
    return Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8')
    
  }

  mockLeadWebhook(){
    return {
      field: "leadgen",
      value: {
        ad_id: "444444444",
        form_id: "444444444444",
        leadgen_id: "444444444444",
        created_time: 1610306426,
        page_id: "444444444444",
        adgroup_id: "44444444444"
      }
    }
  }
}

module.exports = Mocks