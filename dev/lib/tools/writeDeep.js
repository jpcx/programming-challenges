'use strict'

const fsProm = require('fs').promises

module.exports = async (absolutePath, data) => {
  const split = absolutePath.split(/\//g).filter(x => x)
  for (let i = 0; i < split.length; i++) {
    const curPath = `/${split.slice(0, i).join('/')}`
    try {
      await fsProm.mkdir(curPath)
    } catch (err) {
      if (!err.message.match(/eexist/i)) {
        throw err
      }
    }
  }
  await fsProm.writeFile(absolutePath, data)
}
