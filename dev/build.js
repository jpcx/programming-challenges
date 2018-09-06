'use strict'

const fs = require('fs')
const path = require('path')
const settings = require('./buildConfig.json')

const writeDeep = (absolutePath, data) =>
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

const scrape = async () => {
  const routines = fs
    .readdirSync(path.join(__dirname, 'lib/scrape'))
    .filter(x => !x.match(/^\./m))
    .filter(x =>
      fs.statSync(path.join(__dirname, 'lib/scrape', x)).isDirectory()
    )

  for (let name of routines) {
    const mod = require(path.join(
      process.cwd(),
      'dev/lib/scrape',
      name,
      'index.js'
    ))
    const instance = mod(settings)
    instance.listenActivity(console.log)
    const challenges = await instance.run()

    for (let chall of Object.entries(challenges)) {
      const absolutePath = path.join(
        __dirname,
        `../challenges/${name}/${chall[0]}/README.md`
      )

      console.log(`Writing challenge: ${absolutePath}`)

      await writeDeep(absolutePath, chall[1])
    }
  }
}

const populateReadme = async () => {
  const origins = fs
    .readdirSync(path.join(__dirname, '../challenges'))
    .filter(x => !x.match(/^\./m))
    .filter(x =>
      fs.statSync(path.join(__dirname, '../challenges', x)).isDirectory()
    )

  const available = []

  for (let origin of origins) {
    const challenges = fs
      .readdirSync(path.join(__dirname, '../challenges', origin))
      .filter(x => !x.match(/^\./m))
      .filter(x =>
        fs
          .statSync(path.join(__dirname, '../challenges', origin, x))
          .isDirectory()
      )
    for (let challenge of challenges) {
      const matches = challenge.match(
        /^(\d{4}-\d{2}-\d{2}) \[(.*?)\]: (?:\[(.*?)\])? ?(.*)$/i
      )
      const date = matches[1]
      const difficulty = matches[2]
      const tags = matches[3] ? matches[3].split(/, /g) : []
      const linkedTitle = `[${matches[4]}](${settings.homepage}/blob/${
        settings.version
      }/challenges/${origin}/${challenge.replace(/ /g, '+')})`
      const solutions = fs
        .readdirSync(path.join(__dirname, '../challenges', origin, challenge))
        .filter(x => !x.match(/^\./m))
        .filter(x =>
          fs
            .statSync(
              path.join(__dirname, '../challenges', origin, challenge, x)
            )
            .isDirectory()
        ).length
      available.push({ date, origin, linkedTitle, difficulty, solutions, tags })
    }
  }

  const availNumSolutions = available
    .reduce((a, v) => a.concat(v.solutions), [])
    .sort((a, b) => b > a)

  const availDifficulties = [
    'extremely easy',
    'very easy',
    'easy',
    'easy-intermediate',
    'intermediate',
    'hard-intermediate',
    'hard',
    'very hard',
    'extremely hard',
    'unspecified'
  ]

  const allNumSolutions = {}

  for (let n of availNumSolutions) {
    const numSolutions = available.reduce(
      (a, v) => (v.solutions === n ? a.concat(v) : a),
      []
    )
    const allDifficulties = []
    for (let d of availDifficulties) {
      allDifficulties.push(
        numSolutions
          .reduce((a, v) => (v.difficulty === d ? a.concat(v) : a), [])
          .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
      )
    }
    allNumSolutions[n] = allDifficulties.reduce((a, v) => a.concat(v), [])
  }

  const table = Object.entries(allNumSolutions)
    .sort((a, b) => b[0] - a[0])
    .reduce((a, v) => a.concat(v[1]), [])
    .reduce(
      (a, v) =>
        a +
        '| ' +
        v.date +
        ' | ' +
        v.origin +
        ' | ' +
        v.linkedTitle +
        ' | ' +
        v.difficulty +
        ' | ' +
        v.solutions +
        ' | ' +
        v.tags.join(', ') +
        ' |' +
        '\n',
      ''
    )
  const readme = fs
    .readFileSync(path.join(__dirname, '../README.md'), 'utf8')
    .replace(
      /(\| Date \| Origin \| Title \| Difficulty \| Solutions \| Tags \|\n\| -{4} \| -{6} \| -{5} \| -{10} \| -{9} \| -{4} \|)[\s\S]*/,
      '$1\n' + table
    )
  fs.writeFileSync(path.join(__dirname, '../README.md'), readme)
}

scrape()
  .then(() =>
    populateReadme()
      .then(() => console.log('Done!'))
      .catch(console.error)
  )
  .catch(console.error)
