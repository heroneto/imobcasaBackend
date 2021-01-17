const api = require('../instance')
const APP_ID = process.env.FB_APP_KEY
const APP_SECRET = process.env.FB_APP_SECRET_KEY


const checkToken = async (token) => {
  return await api.get("/oauth/access_token", {
    params: {
      fb_exchange_token: token,
      client_id: APP_ID,
      client_secret: APP_SECRET,
      grant_type: "fb_exchange_token"
    }
  })
}

module.exports = checkToken