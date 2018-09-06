'use strict'

const makeReddit = require('../../tools/makeReddit.js')
const scrapeNew = require('./scrapeNew.js')
const scrapeArchiveNames = require('./scrapeArchiveNames.js')
const scrapeRemaining = require('./scrapeRemaining.js')

const convertDifficulty = difficulty => {
  const map = {
    easier: 'very easy',
    easy: 'easy',
    'easy-intermediate': 'easy-intermediate',
    easyintermediate: 'easy-intermediate',
    'easy-medium': 'easy-intermediate',
    easymedium: 'easy-intermediate',
    'easy-med': 'easy-intermediate',
    easymed: 'easy-intermediate',
    intermediate: 'intermediate',
    medium: 'intermediate',
    'practical-exercise': 'intermediate',
    practicalexercise: 'intermediate',
    'hard-intermediate': 'hard-intermediate',
    hardintermediate: 'hard-intermediate',
    'intermediate-hard': 'hard-intermediate',
    intermediatehard: 'hard-intermediate',
    hard: 'hard',
    difficult: 'hard',
    harder: 'very hard',
    bonus: 'very hard',
    extra: 'very hard',
    special: 'very hard'
  }
  if (map[difficulty.toLowerCase()]) {
    return map[difficulty.toLowerCase()]
  } else {
    const entries = Object.entries(map)
    // Using a reverse loop to catch higher difficulties first
    for (let i = entries.length - 1; i >= 0; i--) {
      if (difficulty.match(RegExp(entries[0], 'i'))) {
        return entries[1]
      }
    }
    return 'unspecified'
  }
}

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

      const challenges = {}

      for (let ch of combinedChallenges) {
        const dateStr = new Date(ch.date).toISOString().replace(/T.+/, '')
        let challengeID = ''
        challengeID += dateStr
        if (ch.difficulty) {
          challengeID += ` [${convertDifficulty(ch.difficulty)}]`
        } else {
          challengeID += ' [unspecified]'
        }
        if (ch.title) {
          if (ch.number) {
            challengeID += `: Challenge #${ch.number}: ${ch.title.replace(
              /\//g,
              '\u2044'
            )}`
          } else {
            challengeID += `: ${ch.title.replace(/\//g, '\u2044')}`
          }
        } else {
          if (ch.number) {
            challengeID += `: Challenge #${ch.number}`
          } else {
            challengeID += ': Untitled'
          }
        }

        const parsedDescription =
          ch.description
            .replace(/^(#+)([\w\d])/gm, '$1 $2')
            .replace(/(\[.+\]) (\(.+\))/g, '$1$2')
            .trim() +
          `\n\n---\n\n[Link to origin](https://www.reddit.com/r/dailyprogrammer/${
            ch.name
          })`

        challenges[challengeID] = parsedDescription
      }

      return challenges
    }
  }
}
