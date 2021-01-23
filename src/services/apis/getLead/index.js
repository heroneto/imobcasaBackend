const crypto = require('crypto')
const api = require('../instance')
const APP_SECRET = process.env.FB_APP_SECRET_KEY



const getLead = async (leadId, accessToken) => {
  console.log(leadId)
  const APP_SECRET_PROOF = crypto.createHmac('sha256', APP_SECRET)
                            .update(accessToken)
                            .digest('hex')

  const result = await api.get(`/v9.0/${leadId}`, {
    params: {
      access_token: accessToken,
      appsecret_proof: APP_SECRET_PROOF
    }
  })
  return result.data
}

module.exports = getLead