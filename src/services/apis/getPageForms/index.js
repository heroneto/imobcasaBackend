const api = require('../instance')
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
const FB_PAGE_ID = process.env.FB_PAGE_ID



const getPageForms = async (after, limit = 10) => {
  const result = await api.get(`/v9.0/${FB_PAGE_ID}/leadgen_forms`, {
    params: {
      limit,
      access_token: FB_PAGE_TOKEN,
      after
    }
  })

  return result.data
}

module.exports = getPageForms