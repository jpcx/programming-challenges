'use strict'

const Snoowrap = require('snoowrap')
const postRequest = require('./postRequest.js')
const btoa = str => Buffer.from(str, 'binary').toString('base64')

const requestAccessToken = (id, secret) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.reddit.com',
      path: '/api/v1/access_token',
      method: 'POST',
      headers: {
        authorization: `Basic ${btoa(`${id}:${secret}`)}`
      }
    }
    const postData = { grant_type: 'client_credentials' }
    postRequest(options, postData, 5000)
      .then(data => {
        resolve(data.access_token)
      })
      .catch(reject)
  })

module.exports = (id, secret, userAgent) =>
  new Promise((resolve, reject) =>
    requestAccessToken(id, secret)
      .then(accessToken => resolve(new Snoowrap({ userAgent, accessToken })))
      .catch(reject)
  )
