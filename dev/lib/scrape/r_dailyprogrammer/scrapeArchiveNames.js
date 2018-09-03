'use strict'

module.exports = reddit => {
  let activityListener = activity => null
  return {
    listenActivity: cb => (activityListener = cb),
    run: async () => {
      const wikiPages = await reddit
        .getSubreddit('dailyprogrammer')
        .getWikiPages()
      const wiki = wikiPages.filter(x => x.title === 'challenges')[0]
      if (wiki) {
        const content = await wiki.fetch()
        const challengeContent = content.content_md
          .replace(/^[\s\S]*?#Challenge([\s\S]*)/im, '$1')
          .replace(/[\n\r]+/g, '\n')
          .split(/\n/g)
        let archiveNames = []
        for (let line of challengeContent) {
          if (line) {
            const nameMatch = line.match(
              /r\/dailyprogrammer\/comments\/(.*?)\//
            )
            const titleMatch = line.match(
              /r\/dailyprogrammer\/comments\/.*?\/(.*)\/ ?\)/
            )
            if (nameMatch) {
              activityListener(`Fetching ID for challenge ${titleMatch[1]}`)
              archiveNames.push(nameMatch[1])
            }
          }
        }
        return archiveNames
      } else {
        throw Error('Cannot find wiki')
      }
    }
  }
}
