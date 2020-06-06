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

const internalError = (error) => {
  return {
    statusCode: 500,
    body: error
  }
}
const successfulRequest = (message) => {
  return {
    statusCode: 200,
    body: message
  }
}


module.exports = {forbiden, invalidRequest, unauthorized, internalError, successfulRequest}