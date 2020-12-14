const LeadController = require('../controllers/leads/LeadController')
const leadController = new LeadController()
const { invalidParamError, missingParamError, forbidenError, conflictError } = require('../helpers').errors
const {Lead, User, LeadSource, LeadStatus } = require('../models')
const Mocks = require('./helpers/Mocks')
const ModelsExpected = require('./helpers/ModelsExpected')
const mocks = new Mocks()
const modelsExpected = new ModelsExpected()
const databaseSetup = require('../database')

describe('LEAD CONTROLLER: tests', () => {
  let limitedUser = {}
  let adminUser = {}
  let lead = {}
  let leadStatus = {}
  let leadSource = {}

  beforeAll(async () => {
    try {
      await databaseSetup()
      adminUser = await User.create(mocks.mockUser(true))
      limitedUser = await User.create(mocks.mockUser(false))
      leadStatus = await LeadStatus.create(mocks.mockLeadStatus())
      leadSource = await LeadSource.create(mocks.mockLeadSource())
      lead = await Lead.create(mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id))
    } catch (err) {
      console.log(err.toString())
    }
  }),
    afterAll(async () => {
      try {
        await Lead.destroy({ where: {} })
        await LeadStatus.destroy({ where: {} })
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
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`POST: Should return 400 if no reqUserId has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { admin: adminUser.admin })
      await leadController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('reqUserId')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 409 if existing lead already exists', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.create(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('POST: Should return 200 if lead has been created', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.name = "newName"
      fakeLead.phone = "newPhoneNumber"
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
        const leadMock = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
        leadMock.phone = "11111111111"
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
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mocks.mockReq(fakeLead, {}, { id: lead.id }, { reqUserId: adminUser.id })
      await leadController.update(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError('admin')
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`PUT: Should return 400 if no reqUserId has been send`, async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
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
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      const req = mocks.mockReq(fakeLead, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      await leadController.update(req, res)
      const { error } = conflictError('phone')
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it('PUT: Should return 200 updated', async () => {
      const res = mocks.mockRes()
      const fakeLead = mocks.mockLead(adminUser.id, leadStatus.id, leadSource.id)
      fakeLead.id = leadToUpdate.id
      fakeLead.phone = leadToUpdate.phone
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
    test('LIST: hould return 200 with all leads', async () => {
      const req = mocks.mockReq(null, null, null, { reqUserId: adminUser.id, admin: adminUser.admin })
      const res = mocks.mockRes()
      await leadController.list(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.leadModel())]))
    })
  })
  describe('SEARCH leads', () => {
    const requiredFields = ["value", "reqUserId", "admin"]
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
      const req = mocks.mockReq(null, null, {value: "searchValue"}, { admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("reqUserId")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`SEARCH: Should return 400 if no search value has been send`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {value: "searchValue"}, { reqUserId: adminUser.id})
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      const { error } = missingParamError("admin")
      expect(res.json).toHaveBeenCalledWith(error)
    })
    it(`SEARCH: Should return 200 with leads finded by lead name`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {value: lead.name}, { reqUserId: adminUser.id,  admin: adminUser.admin })
      await leadController.search(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(modelsExpected.leadModel())]))
    })
    it(`SEARCH: Should return 200 with leads finded by lead phone`, async () => {
      const res = mocks.mockRes()
      const req = mocks.mockReq(null, null, {value: lead.phone}, { reqUserId: adminUser.id,  admin: adminUser.admin })
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