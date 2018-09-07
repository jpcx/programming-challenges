const prompt = async (question, parse) => {
  while (true) {
    process.stdin.resume()
    console.log(question)
    const input = await new Promise(resolve => {
      process.stdin.once('data', data => {
        resolve(data.toString().trim())
      })
    })
    try {
      const parsed = parse(input)
      process.stdin.pause()
      return parsed
    } catch (err) {
      console.error(err.message)
    }
  }
}

const parse = input => {
  if (!input.match(/^[+*/-]\d+$/m)) {
    throw Error('Bad input. Try again.')
  } else {
    const availCols = process.stdout.columns
    const o = input.match(/^([+*/-])(\d+)$/m)[1]
    const n = +input.match(/^([+*/-])(\d+)$/m)[2]
    const avgSpace =
      o === '+'
        ? String(n + n).length
        : o === '-'
          ? String(-n).length
          : o === '*' ? String(n * n).length : String(n).length + 3
    const totalSpace = (avgSpace + 1) * n + 1 + avgSpace * 2 + 2
    if (totalSpace > availCols) {
      throw Error('Table is too large to display on your terminal output!')
    }
    return { o, n, avgSpace }
  }
}

const solve = async () => {
  console.log(
    'This script writes an arithmetic or geometric table to stdout!\n'
  )
  const parsedInput = await prompt(
    'Please type an operation (+-*/) followed by a whole number.',
    parse
  )
  const o = parsedInput.o
  const n = parsedInput.n

  const avgSpace = parsedInput.avgSpace

  const pad = x => String(x).padStart(avgSpace, ' ')

  console.log(
    '\n' +
      pad(o) +
      ' │ ' +
      Array(n + 1)
        .fill(0)
        .map((x, i) => pad(i))
        .join(' ') +
      '\n' +
      Array(avgSpace + 2).join('─') +
      '┼' +
      Array((1 + avgSpace) * n + 1 + avgSpace)
        .fill('─')
        .join('') +
      '\n' +
      Array(n + 1)
        .fill(0)
        .map(
          (x, i) =>
            pad(i) +
            ' │ ' +
            Array(n + 1)
              .fill(0)
              .map((x2, i2) => {
                if (o === '+') {
                  return pad(i2 + i)
                } else if (o === '-') {
                  return pad(i2 - i)
                } else if (o === '*') {
                  return pad(i2 * i)
                } else {
                  if (i > 0) {
                    return pad((i2 / i).toFixed(2))
                  } else {
                    return pad('0')
                  }
                }
              })
              .join(' ')
        )
        .join('\n')
  )
}

solve().catch(console.error)
