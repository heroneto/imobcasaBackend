const LeadController = require('../controllers/leads/LeadController')
const leadController = new LeadController()
const { invalidParamError, missingParamError, forbidenError, conflictError } = require('../helpers').errors
const { Lead, User, LeadSource, LeadStatus, Userscampaigns, Campaign } = require('../models')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const databaseSetup = require('../database')

describe('LEAD CONTROLLER: tests', () => {
  let limitedUser = {}
  let adminUser = {}
  let lead = {}
  let lead2 = {}
  let lead3 = {}
  let lead4 = {}
  let leadStatus = new Array()
  let leadSource = {}
  let campaign = {}
  let userscampaings = {}

  beforeAll(async () => {
    try {
      await databaseSetup()
      adminUser = await User.create(mocks.mockUser(true))
      limitedUser = await User.create(mocks.mockUser(false))
      leadSource = await LeadSource.create(mocks.mockLeadSource())
      const statusMocks = mocks.mockLeadStatus()
      for (const mock of statusMocks) {
        await leadStatus.push(await LeadStatus.create(mock))
      }
      campaign = await Campaign.create(mocks.mockCampaign())
      userscampaings = await Userscampaigns.create(mocks.mockUsersCampaings(adminUser.id, campaign.id))
      lead = await Lead.create(mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id))
      lead2 = await Lead.create(mocks.mockLead(adminUser.id, leadStatus[1].id, leadSource.id, campaign.id))
      lead3 = await Lead.create(mocks.mockLead(adminUser.id, leadStatus[2].id, leadSource.id, campaign.id))
      lead4 = await Lead.create(mocks.mockLead(adminUser.id, leadStatus[3].id, leadSource.id, campaign.id))
    } catch (err) {
      console.error(err)
    }
  }),
  afterAll(async () => {
    try {
      await Userscampaigns.destroy({where: {}})
      await Lead.destroy({ where: {} })
      await LeadStatus.destroy({ where: {} })
      await Campaign.destroy({where: {}})
      await User.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })
  describe('GET Leads', () => {
    it('GET: Should return 400 if no id has been send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq({}, {}, {}, {})
      await leadController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 if no reqUserId has been send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq({}, {}, { id: lead.id }, {})
      await leadController.getOne(req, res)
      expect(res.status).toBeCalledWith(400)
      const { error } = missingParamError('reqUserId')
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 if invalid id has been send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq({}, {}, { id: "InvalidId" }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.getOne(req, res)
      expect(res.status).toBeCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 400 with forbiden message if reqUserId does not match with userid in lead properties', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq({}, {}, { id: lead.id }, { reqUserId: limitedUser.id, admin: limitedUser.admin })
      await leadController.getOne(req, res)
      const { error } = forbidenError()
      expect(res.status).toBeCalledWith(403)
      expect(res.json).toBeCalledWith(error)
    })
    it('GET: Should return 200 if lead has been found', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq({}, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.getOne(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toBeCalledWith(expect.objectContaining(modelsExpected.leadModel()))
    })
  })
  describe('POST Leads', () => {
    const requiredFields = ["name", "phone", "sourceid", "campaignid", "userid", "active", "statusid", "negociationStartedAt"]
    for (const field of requiredFields) {
      it(`POST: Should return 400 if no ${field} has been send`, async () => {
        const res = mocks.mockRes()
        const fakeLead = mocks.mockLead()
        delete fakeLead[`${field}`]
        const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
        await leadController.create(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError(field)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    it(`POST: Should return 400 if no admin has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`POST: Should return 400 if no reqUserId has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('reqUserId')
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it("POST: Should return 400 if invalid userid was provided", async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead("invalidUserId", leadStatus[0].id, leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('userid')
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it("POST: Should return 400 if invalid statusid was provided", async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, "invalidStatusId", leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('statusid')
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it("POST: Should return 400 if invalid sourceid was provided", async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, "invalidsourceid", campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('sourceid')
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it("POST: Should return 400 if invalid campaignid was provided", async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, "invalidCampaignId")
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('campaignid')
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it("POST: Should return 400 if userid provided does not exists in campaign users", async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(limitedUser.id, leadStatus[0].id, leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError("User does not exists in campaign")
      expect(res.json).toHaveBeenCalledWith(error)
    }),
    it('POST: Should return 409 if existing lead already exists', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id, lead.phone)
      const req = mocks.mockReq(fakeLead, {}, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 200 if lead has been created', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(modelsExpected.leadModel()))
    })
  })
  describe('PUT Leads', () => {
    let leadToUpdate
    beforeAll(async () => {
      try {
        const leadMock = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id)
        leadToUpdate = await Lead.create(leadMock)
      } catch (err) {
        console.log(err.toString())
      }
    }),
      afterAll(async () => {
        try {
          await Lead.destroy({
            where: {
              id: leadToUpdate.id
            }
          })
        } catch (err) {
          console.log(err)
        }
      })
    const requiredFields = ["id", "name", "phone", "sourceid", "campaignid", "userid", "active", "statusid", "negociationStartedAt"]
    for (const field of requiredFields) {
      it(`PUT: Should return 400 if no ${field} has been send`, async () => {
        const res = mocks.mockRes()
        const fakeLead = mocks.mockLead()
        fakeLead.id = leadToUpdate.id
        delete fakeLead[`${field}`]
        const req = mocks.mockReq(fakeLead, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
        await leadController.update(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        const { error } = missingParamError(field)
        expect(res.json).toHaveBeenCalledWith(error)
      })
    }
    it(`PUT: Should return 400 if no admin has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id })
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`PUT: Should return 400 if no reqUserId has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { admin: adminUser.admin })
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('reqUserId')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('PUT: Should return 400 if invalid id has been send', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead()
      fakeLead.id = 'FakeId'
      const req = mocks.mockReq(fakeLead, {}, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = invalidParamError('id')
      expect(res.json).toBeCalledWith(error)
    })
    it('PUT: Should return 409 if phone already used in another lead', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id, leadToUpdate.phone)
      fakeLead.id = lead.id
      const req = mocks.mockReq(fakeLead, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.update(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('PUT: Should return 200 updated', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus[0].id, leadSource.id, campaign.id, leadToUpdate.phone)
      fakeLead.id = leadToUpdate.id
      fakeLead.name = "New Lead Name"
      const req = mocks.mockReq(fakeLead, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ...modelsExpected.leadModel(),
        name: fakeLead.name,
        phone: fakeLead.phone,
        id: fakeLead.id
      }))
    })

  })
  describe('LIST Leads', () => {
    test("LIST: should return 400 if no skip has been send", async () => {
      const query = mocks.mockLeadPaginationQuery(null, null, leadStatus[0].id)
      delete query.skip
      const req = mocks.mockReq(null, query, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      const { error } = missingParamError("skip")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test("LIST: should return 400 if no limit has been send", async () => {
      const query = mocks.mockLeadPaginationQuery(null, null, leadStatus[0].id)
      delete query.limit
      const req = mocks.mockReq(null, query, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      const { error } = missingParamError("limit")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    test(`LIST: should return 200 with all leads with specific status id`, async () => {
      const query = mocks.mockLeadPaginationQuery(null, null, leadStatus[0].id)

      const req = mocks.mockReq(null, query, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.leadModel(),
        statusid: leadStatus[0].id
      })]))
    })
    test(`LIST: should return 200 with all leads with specific status id`, async () => {
      const query = mocks.mockLeadPaginationQuery(null, null, leadStatus[1].id)

      const req = mocks.mockReq(null, query, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.leadModel(),
        statusid: leadStatus[1].id
      })]))
    })
    test(`LIST: should return 200 with all leads with specific status id`, async () => {
      const query = mocks.mockLeadPaginationQuery(null, null, leadStatus[2].id)
      const req = mocks.mockReq(null, query, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
        ...modelsExpected.leadModel(),
        statusid: leadStatus[2].id
      })]))
    })
  })
  describe('SEARCH leads', () => {
    it(`SEARCH: Should return 400 if no search value has been send`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("value")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`SEARCH: Should return 400 if no reqUserId value has been send`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { value: "searchValue" }, { admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("reqUserId")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`SEARCH: Should return 400 if no search value has been send`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { value: "searchValue" }, { reqUserId: adminUser.id })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("admin")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`SEARCH: Should return 200 with leads finded by lead name`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { value: lead.name }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.leadModel())]))
    })
    it(`SEARCH: Should return 200 with leads finded by lead phone`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { value: lead.phone }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.leadModel())]))
    })
  })
  describe('DELETE Leads', () => {
    it('DELETE: Should return 400 if no ID has been send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.delete(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("id")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('DELETE: Should return 400 if invalid ID has been send', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { id: "invalidId" }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.delete(req, res)
      const { error } = invalidParamError("id")
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('DELETE: Should return 403 if userid does not match with id provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { id: lead.id }, { reqUserId: limitedUser.id, admin: limitedUser.admin })
      await leadController.delete(req, res)
      const { error } = forbidenError()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('DELETE: Should return 200 if valid id has been provided', async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.delete(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(1)
    })
  })

})