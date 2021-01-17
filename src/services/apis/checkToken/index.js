const api = require('../instance')



const checkToken = async (token) => {
  return await api.get("/oauth/access_token", {
    params: {
      fb_exchange_token: token,
      client_id: "",
      client_secret: "",
      grant_type: "fb_exchange_token"
    }
  })
}

module.exports = checkToken