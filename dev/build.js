'use strict'

const fsProm = require('fs').promises
const path = require('path')
const settings = require('./buildConfig.json')

const scrape = async () => {
  const routines = (await fsProm.readdir(
    path.join(process.cwd(), 'dev/lib/scrape')
  )).filter(x => !x.match(/^\./m))

  for (let name of routines) {
    const mod = require(path.join(
      process.cwd(),
      'dev/lib/scrape',
      name,
      'index.js'
    ))
    const instance = mod(settings)
    instance.listenActivity(console.log)
    await instance.run()
  }
}

scrape()
  .then(console.log)
  .catch(console.log)
