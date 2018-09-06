'use strict'

const https = require('https')
const qs = require('qs')

const handleResponse = res =>
  new Promise((resolve, reject) => {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', chunk => {
      body += chunk
    })
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          resolve(JSON.parse(body))
        } catch (err) {
          if (err.message.match(/unexpected token/i)) {
            resolve(body)
          } else {
            reject(err)
          }
        }
      } else {
        reject(Error(res.statusCode + ' ' + res.statusMessage))
      }
    })
  })

module.exports = (options, postData, timeout) =>
  new Promise((resolve, reject) => {
    const req = https.request(options, res =>
      handleResponse(res)
        .then(resolve)
        .catch(reject)
    )
    req.on('error', err => req.abort() && reject(err))
    if (timeout) {
      req.setTimeout(
        timeout,
        () => req.abort() && reject(Error('ETIMEDOUT'))
      )
    }
    if (options.method === 'POST') req.write(qs.stringify(postData))
    req.end()
  })
