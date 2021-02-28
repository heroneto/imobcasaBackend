const Service = require("../Service")
const { getPageForms } = require('../apis')
const {FormRepository} = require('../../repositories')

class FacebookService extends Service{

  constructor(){
    super()
    this._formRepository = new FormRepository()
  }

  _filterFormsRegistred(forms, formsIdRegistred) {
    return forms.filter(form => !formsIdRegistred.includes(form.id))
  }

  async listPageForms(fields){
    const { after } = fields
    
    const {data, paging } = await getPageForms(after)
    if(data.length === 0){
      return {
        forms: [],
        after: "",
        next: ""  
      }
    }
    const { cursors, next } = paging

    const formsRegistred = await this._formRepository.list()
    const fbFormIdRegistred = formsRegistred.map(form => form.fbFormId)
    const forms = this._filterFormsRegistred(data, fbFormIdRegistred)

    return {
      forms: forms,
      after: cursors.after ? cursors.after : "",
      next: next ? next : ""
    }
  }
  
}

module.exports = FacebookService