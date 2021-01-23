const axios  = require('axios').default

const instance = axios.create({
  baseURL: "https://graph.facebook.com",
  
})


module.exports = instance