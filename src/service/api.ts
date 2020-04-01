'use strict'

const axios = require('axios')

module.exports = {
  token: process.env.CODENATION_API_TOKEN,
  proxy_url: 'https://cors-anywhere.herokuapp.com/',
  base_url: 'https://api.codenation.dev/v1/challenge/dev-ps',
  headers: 'Content-Type: multipart/form-data'
}
