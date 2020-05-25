const forbiden = (error) => {
  return {
    statusCode: 403,
    body: error
  }
}

const invalidRequest = (error) => {
  return {
    statusCode: 400,
    body: error
  }
}

const unauthorized = (error) => {
  return {
    statusCode: 401,
    body: error
  }
}


module.exports = {forbiden, invalidRequest, unauthorized}