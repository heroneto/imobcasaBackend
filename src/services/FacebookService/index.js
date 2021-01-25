const Service = require("../Service")
const { getPageForms } = require('../apis')

class FacebookService extends Service{

  constructor(){
    super()
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

    return {
      forms: data,
      after: cursors.after ? cursors.after : "",
      next: next ? next : ""
    }
  }
  
}

module.exports = FacebookService