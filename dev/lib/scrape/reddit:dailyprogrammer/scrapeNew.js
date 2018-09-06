'use strict'

const parseTitle = require('./parseTitle.js')

module.exports = reddit => {
  let activityListener = activity => null
  return {
    listenActivity: cb => (activityListener = cb),
    run: async () => {
      const newChallenges = []
      let after = ''
      while (true) {
        const starttm = Date.now()
        const results = await reddit
          .getSubreddit('dailyprogrammer')
          .fetch()
          .getNew({ after })
        if (results.length === 0) break
        for (let res of results) {
          const titleProps = parseTitle(res.title)
          if (titleProps) {
            const challenge = {
              name: res.name.replace(/^t3_/m, ''),
              date: res.created_utc * 1000,
              number: titleProps.number,
              difficulty: titleProps.difficulty,
              title: titleProps.title,
              fullTitle: res.title,
              description: res.selftext
            }
            activityListener(
              `Scraped challenge #${challenge.number}: ${challenge.title}`
            )
            newChallenges.push(challenge)
          }
        }
        after = 't3_' + newChallenges.slice(-1)[0].name
        if (Date.now() - starttm < 1000) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 - (Date.now() - starttm))
          )
        }
      }
      return newChallenges
    }
  }
}
