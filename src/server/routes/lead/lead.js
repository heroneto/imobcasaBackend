var express = require('express')
var router = express.Router()
const { searchLeads, getLead, getAllLeads, createLead, updateLead, deleteLead } = require('../../controllers').leads
const { checkAuthentication } = require('../../middlewares').auth
const { checkAdminPrivileges } = require('../../middlewares').admin

router.route('/lead')
.all(checkAuthentication)
.get(getLead)
.post(createLead)
.put(updateLead)
.delete(deleteLead)

router.route('/leads')
.all(checkAuthentication)
.all(checkAdminPrivileges)
.get(getAllLeads) 

router.route('/lead/search')
.all(checkAuthentication)
.get(searchLeads)


module.exports = { router }