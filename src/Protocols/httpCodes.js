const accessDenied = (error) => {
  return {
    statusCode: 403,
    body: error
  }
}


module.exports = {accessDenied}