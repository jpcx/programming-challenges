'use strict'

const parseTitle = require('./parseTitle.js')

module.exports = reddit => {
  let activityListener = activity => null
  return {
    listenActivity: cb => (activityListener = cb),
    run: async (newChallenges, archiveNames) => {
      const newNames = newChallenges.map(x => x.name)
      const fetchList = archiveNames.reduce(
        (a, v) => (!newNames.includes(v) ? a.concat(v) : a),
        []
      )
      const fetchedChallenges = []
      reddit.config({ proxies: false })
      for (let fet of fetchList) {
        const starttm = Date.now()
        const res = await reddit.getSubmission(fet).fetch()
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
            `Fetched challenge #${challenge.number}: ${challenge.title}`
          )
          fetchedChallenges.push(challenge)
        }
        if (Date.now() - starttm < 1000) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 - (Date.now() - starttm))
          )
        }
      }
      return [...newChallenges, ...fetchedChallenges].sort(
        (a, b) => a.created_utc > b.created_utc
      )
    }
  }
}
