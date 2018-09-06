'use strict'

const fs = require('fs')

module.exports = (absolutePath, data) =>
  new Promise((resolve, reject) => {
    const split = absolutePath.split(/\//g).filter(x => x)
    for (let i = 0; i < split.length; i++) {
      const curPath = `/${split.slice(0, i).join('/')}`
      try {
        fs.mkdirSync(curPath)
      } catch (err) {
        if (!err.message.match(/eexist/i)) {
          reject(err)
        }
      }
    }
    fs.writeFileSync(absolutePath, data)
    resolve()
  })
