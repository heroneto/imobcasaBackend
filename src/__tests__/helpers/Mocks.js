const { User } = require('../../models')
const JwtImplementation = require('../../implementations/jwt')
const crypto = require('crypto')
const { getPageForms } = require('../../services/apis')


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

  mockUser(admin = true, username = "mockedUser") {
    return {
      username: username,
      fullName: "ValidFullName",
      email: "valid@email.com",
      password: "validPassword",
      passwordConfirmation: "validPassword",
      admin: admin,
      active: true,
    }
  }

  mockPwdChange(password, newPassword) {
    return {
      password,
      newPassword
    }
  }

  mockPwdReset(password, id) {
    return {
      password,
      id
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

  mockLead(userid, statusid, sourceId, formid = null, phone = (Math.round(Math.random() * 100000000000).toString())) {
    const fakeLead = {
      name: "Fake Lead",
      phone,
      sourceid: sourceId,
      formid: formid,
      userid: userid,
      active: true,
      statusid: statusid,
      negociationStartedAt: new Date()
    }
    return fakeLead
  }

  mockUserForm(userid, formid){
    return {
      userid,
      formid
    }
  }

  mockLeadSource(name="Manual") {
    return {
      name,
      active: true,
    }
  }

  mockLeadStatus(name = "To do", description = 'Represents an item that is in the queue for execution') {
    return [
      {
        name: 'To do',
        description: 'Represents an item that is in the queue for execution',
        order: 1,
      },
      {
        name: 'Negociação em andamento',
        description: 'A negocaiação deste Lead está em andamento',
        order: 2,
      },
      {
        name: 'Negociação concluída',
        description: 'A negociação deste Lead foi concluída com sucesso',
        order: 3,
      },
      {
        name: 'Arquivado',
        description: 'Este Lead está arquivado.',
        order: 0,
      }
    ]
  }

  mockForm(fbFormId = "FAKE FORM ID") {
    const fakeForm = {
      name: "fakeFormName",
      active: true,
      fbCreatedDate: new Date(),
      fbFormId
    }
    return fakeForm
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

  mockSubscriveRequest(hubmode = 'subscribe', verifyToken = process.env.FB_SUB_TOKEN, hubChallenge = "challengeSecret"){
    return {
      'hub.mode': hubmode,
      'hub.verify_token': verifyToken,
      'hub.challenge': hubChallenge,
    }
  }

  mockXHubSignature(body, appSecret = process.env.FB_APP_SECRET_KEY){
    const payload = JSON.stringify(body)
    return `sha1=${crypto.createHmac('sha1', appSecret).update(payload).digest('hex')}`
  }

  mockLeadWebhook(
    id = Math.floor(Math.random() * 10**15).toString(),
    formId = Math.floor(Math.random() * 10**16).toString(),
    leadgenId = Math.floor(Math.random() * 10**15).toString(),
    pageId = Math.floor(Math.random() * 10**15).toString(),
    ){
    return {
      object: "page",
      entry: [
        {
          id: id,
          time: Date.now(),
          changes: [
            {
              value: {
                form_id: formId,
                leadgen_id: leadgenId,
                created_time: Date.now(),
                page_id: pageId
              },
              field: "leadgen"
            }
          ]
        }
      ]
    }
  }

  mockFBMarketingToken(){
    return "EAAHZB7hHSoq4BAFsFeAHpONhIkOB4iz64iGaqVU6EvmEfgz0lKnRrVnKDBkDCB5UXkqj8ZCeVFQIw3D3YPfYpsxTZC6movOIKQNI6HKwe6AhfuZAUGJcFvndhpcizTIvWEGo11YSXw75GuDuVctjHN5XJ7VqxMMZD"
  }

  mockValidLeadID(){
    return "1176190902783627"
  }

  mockFakeFormID(){
    return Math.floor(Math.random() * 10**16).toString()
  }


  async mockAfterProp(){
    const {paging} = await getPageForms()  
    const { cursors } = paging
    return cursors.after
  }  

}

module.exports = Mocks