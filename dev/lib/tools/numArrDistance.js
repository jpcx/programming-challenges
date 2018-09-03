'use strict'

module.exports = (arrA, arrB) => {
  const areIdentical =
    arrA.length === arrB.length &&
    arrA.reduce((a, v, i) => a && v === arrB[i], true)
  if (areIdentical) return 0

  const disorder = (() => {
    const indices = arrA.map(x => arrB.indexOf(x))
    return indices.reduce((a, v, i) => a + Math.abs(v - i), 0)
  })()

  const dissimilarity = (() => {
    const lenDist = Math.abs(arrA.length - arrB.length)
    const simDist = Math.abs(new Set(arrA).size - new Set(arrB).size)
    return lenDist + simDist
  })()

  return disorder + dissimilarity
}
