const fs = require('fs')
const path = require('path')

const readENABLE = () =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './enable1.txt'), 'utf8', (err, data) => {
      if (err) reject(err)
      else {
        resolve(
          data
            .trim()
            .split('\n')
            .map(x => x.trim().toLowerCase())
        )
      }
    })
  })

const genPossibleCombinations = (con, vow) => {
  const results = []

  const convertMem = (a, b, posMem) => {
    let retStr = ''
    for (let p of posMem) {
      if (!p) {
        retStr += a[0]
        a = a.slice(1)
      } else {
        retStr += b[0]
        b = b.slice(1)
      }
    }
    return retStr
  }

  const memPos = (bPos, mem) =>
    mem.reduce(
      (a, v, i) =>
        a.constructor === Object
          ? v ? (a.ct === bPos ? i : ++a.ct && a) : a
          : a,
      { ct: 0 }
    )

  const shiftMem = (bPosMem, mem) =>
    mem.reduce(
      (a, v, i) =>
        i === bPosMem - 1
          ? a.concat(1)
          : i === bPosMem ? a.concat(0) : a.concat(v),
      []
    )

  const recurse = (a, b, bPos = 0, mem = []) => {
    if (mem.length === 0) {
      mem = Array(a.length)
        .fill(0)
        .concat(Array(b.length).fill(1))
      results.push(convertMem(a, b, mem))
    }
    let bPosMem = memPos(bPos, mem)
    while (bPosMem > 0 && mem[bPosMem - 1] !== 1) {
      mem = shiftMem(bPosMem, mem)
      results.push(convertMem(a, b, mem))
      if (
        memPos(b.length - 1, mem) - memPos(0, mem) > b.length - 1 &&
        bPos + 1 < b.length
      ) {
        recurse(a, b, bPos + 1, mem)
      }
      bPosMem = memPos(bPos, mem)
    }
  }

  recurse(con, vow)

  return results
}

const genExplosions = possibleCombinations => {
  const genRegexes = (n, max) => {
    const regStrings = []
    const getLen = regStr =>
      regStr.match(/\(\.+\)/g).reduce((a, v) => a + v.length - 2, 0)
    const recurse = (
      regStr = '^' +
        Array(n)
          .fill('(.)')
          .join('')
    ) => {
      if (getLen(regStr) <= max && !regStrings.includes(regStr)) {
        regStrings.push(regStr)
        const match = regStr.match(/\(\.+\)/g)
        for (let i = 0; i < match.length; i++) {
          recurse(
            '^' +
              match
                .map((x, j) => (i === j ? x.replace(/\./, '..') : x))
                .join('')
          )
        }
      }
    }

    recurse()

    return regStrings.map(x => RegExp(x, 'm'))
  }

  const explode = (str, regexes) =>
    regexes.reduce(
      (a, v) =>
        a.concat(
          str.replace(
            v,
            v
              .toString()
              .match(/\(\.+\)/g)
              .map((x, i) => `$${i + 1}_`)
              .join('')
          )
        ),
      []
    )

  let results = possibleCombinations

  for (let str of possibleCombinations) {
    for (let n = 1; n <= str.length - 1; n++) {
      const regexes = genRegexes(n, str.length - 1)
      results = results.concat(explode(str, regexes))
    }
  }

  return results
}

const solve = async (con, vow) => {
  console.log('Fetching word list...')
  const wordList = await readENABLE()
  console.log('Done')
  console.log('Generating possible combinations...')
  const possibleCombinations = genPossibleCombinations(con, vow)
  console.log('Done')
  console.log('Generating explosions...')
  const explosions = genExplosions(possibleCombinations)
  console.log('Done')
  console.log('Filtering explosions...')
  const wordsOnly = explosions.filter(
    x => !x.split(/_/g).some(x => !wordList.includes(x.toLowerCase()))
  )
  console.log('Done')
  console.log('Sorting by average word length...')
  wordsOnly.sort((a, b) => b.match(/_/g).length - a.match(/_/g).length)
  console.log('Done')
  for (let words of wordsOnly) {
    console.log(words.replace(/_/g, ' '))
  }
}

solve('wwllfndffthstrds', 'eieoeaeoi').catch(console.error)
