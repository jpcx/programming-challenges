'use strict'

const leven = require('leven')
const arrDist = require('../../tools/numArrDistance.js')

module.exports = title => {
  const difficulties = [
    'easy',
    'intermediate',
    'medium',
    'hard',
    'difficult',
    'bonus',
    'extra',
    'special',
    'practical',
    'exercise'
  ]
  const components = title
    .replace(/# (\d)/g, '#$1')
    .replace(/[chaleng]{8,}(#\d)/i, 'challenge $1')
    .replace(/([^ \n\r[(])(\[|\()/g, '$1 $2')
    .replace(/(\]|\))([^ \n\r\])])/g, '$1 $2')
    .split(/ /g)
    .filter(x => x !== '')
  let flow = []
  for (let compo of components) {
    if (compo.match(/\d+[-/]\d+[-/]\d+/)) {
      flow.push({
        value: compo.match(/\d+[-/]\d+[-/]\d+/)[0],
        type: 'date'
      })
    } else if (leven(compo, 'challenge') <= 1) {
      flow.push({
        value: compo,
        type: 'challenge'
      })
    } else if (compo.match(/^#?(\d+[abc]?)$/im)) {
      flow.push({
        value: compo.match(/^#?(\d+[abc]?)$/im)[1],
        type: 'number'
      })
    } else if (
      difficulties.some(
        x => leven(compo.replace(/[[()\]]/g, '').toLowerCase(), x) <= 1
      ) ||
      compo
        .split(/[-/]/g)
        .some(x =>
          difficulties.some(
            y => leven(x.replace(/[[()\]]/g, '').toLowerCase(), y) <= 1
          )
        )
    ) {
      flow.push({
        value: compo,
        type: 'difficulty'
      })
    } else {
      flow.push({
        value: compo,
        type: 'other'
      })
    }
  }
  flow = flow.reduce((a, v) => {
    if (
      a.length > 0 &&
      v.type === 'other' &&
      a[a.length - 1].type === 'other'
    ) {
      a[a.length - 1].value += ' ' + v.value
    } else if (
      a.length > 1 &&
      v.type === 'other' &&
      a[a.length - 1].type !== 'other' &&
      a[a.length - 2].type === 'other'
    ) {
      a[a.length - 2].value += ' ' + a[a.length - 1].value
      a[a.length - 2].value += ' ' + v.value
      a.pop()
    } else if (
      a.length > 0 &&
      v.type === 'difficulty' &&
      a[a.length - 1].type === 'difficulty'
    ) {
      a[a.length - 1].value += v.value
    } else if (
      a.length > 0 &&
      v.value === 'er' &&
      a[a.length - 1].type === 'difficulty'
    ) {
      if (leven(a[a.length - 1].value.toLowerCase(), 'easy') <= 1) {
        a[a.length - 1].value = 'easier'
      } else if (leven(a[a.length - 1].value.toLowerCase(), 'hard') <= 1) {
        a[a.length - 1].value = 'harder'
      } else {
        a[a.length - 1].value += '-er'
      }
    } else if (
      a.length > 1 &&
      v.type === 'difficulty' &&
      a[a.length - 2].type === 'difficulty' &&
      a[a.length - 1].value.match(/^(?:\/|-|to)$/m)
    ) {
      a[a.length - 2].value += '-' + v.value
      a.pop()
    } else {
      a.push(v)
    }
    return a
  }, [])

  const desired = ['date', 'challenge', 'number', 'difficulty', 'other']

  const typeFlow = flow.map(x => x.type).filter(x => x)

  let score = arrDist(typeFlow, desired)

  if (typeFlow[0] === 'difficulty') score /= 2
  else if (title.match(/weekly|week-long/i)) score *= 2

  if (score <= 6) {
    const props = {}
    const target = new Set(
      typeFlow.filter(x => x !== 'challenge' && x !== 'other')
    ).size
    let found = 0
    for (let i = 0; i < flow.length; i++) {
      const prop = flow[i]
      if (found < target) {
        if (prop.type === 'date' && !props.date) {
          props.date = prop.value.replace(/[\n\r]/g, '')
          found++
        } else if (prop.type === 'number' && !props.number) {
          if (
            flow[i - 1] &&
            (flow[i - 1].type === 'challenge' || flow[i - 1].type === 'date')
          ) {
            props.number = prop.value.replace(/[\n\r]/g, '')
            found++
          }
        } else if (prop.type === 'difficulty' && !props.difficulty) {
          props.difficulty = prop.value
            .replace(/^\[(.+)]$/m, '$1')
            .replace(/ ?\/ ?/g, '-')
            .replace(/[\n\r]/g, '')
          found++
        }
      } else {
        if (!props.title) {
          props.title = prop.value.replace(/[\n\r]/g, '')
        } else {
          props.title += ' ' + prop.value.replace(/[\n\r]/g, '')
        }
      }
    }
    if (props.title) {
      props.title = props.title
        .replace(/^'? ?\((.*)\) ?'?$/m, '$1')
        .replace(/^ *?-+ *?(.+)/, '$1')
    }
    return props
  } else {
    return false
  }
}
