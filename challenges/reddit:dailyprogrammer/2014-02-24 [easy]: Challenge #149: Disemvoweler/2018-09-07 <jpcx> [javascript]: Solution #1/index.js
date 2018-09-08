const testA = 'all those who believe in psychokinesis raise my hand'
const soluA = ['llthswhblvnpsychknssrsmyhnd', 'aoeoeieeioieiaiea']
const testB =
  'did you hear about the excellent farmer who was outstanding in his field'
const soluB = [
  'ddyhrbtthxcllntfrmrwhwststndngnhsfld',
  'ioueaaoueeeeaeoaouaiiiie'
]

const disemvowel = input =>
  Object.values(input).reduce(
    (a, v) =>
      v.match(/[aeiou]/)
        ? (a[1] += v) && a
        : !v.match(/ /) ? (a[0] += v) && a : a,
    ['', '']
  )

const test = () => {
  const a = disemvowel(testA)
  const b = disemvowel(testB)
  return (
    a[0] === soluA[0] &&
    a[1] === soluA[1] &&
    b[0] === soluB[0] &&
    b[1] === soluB[1]
  )
}

if (test()) {
  console.log('Passed test!')
} else {
  throw Error('Failed!')
}

const str = 'this is the input that will be used to display disemvoweler output'
console.log('Input: ' + str)
const out = disemvowel(str)
console.log(out[0])
console.log(out[1])