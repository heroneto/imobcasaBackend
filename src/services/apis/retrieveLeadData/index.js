const axios = require('axios')
const crypto = require('crypto')

const ACCESS_TOKEN = "EAAHZB7hHSoq4BAHV5mRGCah3lHeTc8wtgpurb6N2vkSBZAOIwJQSIAUO62LpXWxznqAlD5QoQCikRiDLJaeo5tknFOfZCt4yjPL3O1OKAW4LbwTZBNwMBzd8Ypm2u4J65ozwK2RIv0u9xXBwS6GZA7kqZArNEZBXdSWEeUZA1D2f6gZDZD"
const APP_SECRET = "658682f24b9ce5a1e4d31aa16cd79a29"
const APP_SECRET_PROOF = crypto.createHmac('sha256', APP_SECRET).update(ACCESS_TOKEN).digest('hex')

console.log(APP_SECRET_PROOF)

const getLead = (leadId) => {
    
}