'use strict'

const path = require('path')
const makeReddit = require('../../tools/makeReddit.js')
const scrapeNew = require('./scrapeNew.js')
const scrapeArchiveNames = require('./scrapeArchiveNames.js')
const scrapeRemaining = require('./scrapeRemaining.js')
const writeDeep = require('../../tools/writeDeep.js')

module.exports = settings => {
  let activityListener = activity => null
  const { id, secret } = require('../../tools/redditAuth.json')
  const userAgent = settings.userAgent
  return {
    listenActivity: cb => (activityListener = cb),
    run: async () => {
      const reddit = await makeReddit(id, secret, userAgent)

      const newScraper = scrapeNew(reddit)
      const archiveNameScraper = scrapeArchiveNames(reddit)
      const remainingScraper = scrapeRemaining(reddit)
      newScraper.listenActivity(activityListener)
      archiveNameScraper.listenActivity(activityListener)
      remainingScraper.listenActivity(activityListener)

      activityListener('Scraping new challenges...')
      const newChallenges = await newScraper.run()
      activityListener('Scraping archive table...')
      const archiveNames = await archiveNameScraper.run()
      activityListener('Scraping remaining challenges...')
      const combinedChallenges = await remainingScraper.run(
        newChallenges,
        archiveNames
      )

      for (let ch of combinedChallenges) {
        const date = new Date(ch.date)
        const dateStr = `${date.getUTCFullYear()}-${String(
          date.getUTCMonth()
        ).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
        let pathStr = dateStr + ' Challenge'
        if (ch.number) {
          pathStr += ` #${ch.number.replace(/[\n\r]/g, '')}`
        }
        if (ch.difficulty) {
          pathStr += ` [${ch.difficulty
            .replace(/\b[a-z]/i, x => x.toUpperCase())
            .replace(/[\n\r]/g, '')}]`
        }
        if (ch.title) {
          pathStr += `: ${ch.title
            .replace(/\//g, '\u2044')
            .replace(/[\n\r]/g, '')}`
        }
        const absolutePath = path.join(
          __dirname,
          `../../../../challenges/r_dailyprogrammer/${pathStr}/README.md`
        )
        activityListener(`Writing challenge: ${absolutePath}`)
        await writeDeep(absolutePath, ch.description)
      }
    }
  }
}
