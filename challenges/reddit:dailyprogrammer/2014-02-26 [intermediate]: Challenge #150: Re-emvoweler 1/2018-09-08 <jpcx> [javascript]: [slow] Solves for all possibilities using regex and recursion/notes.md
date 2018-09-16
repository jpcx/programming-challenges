# Notes

Given two strings, find all possible combinations between them while preserving order.

Sample strings:
`abcde`
`xyz`

## Explosion

__String 1:__

+ abcde
+ a_bcde
+ ab_cde
+ abc_de
+ abcd_e
+ a_b_cde
+ ab_c_de
+ abc_d_e
+ a_bc_de
+ a_bcd_e
+ ab_cd_e
+ a_b_c_de
+ ab_c_d_e
+ a_bc_d_e
+ a_b_cd_e
+ a_b_c_d_e

__String 2:__

+ xyz
+ x_yz
+ xy_z
+ x_y_z

The initial problem at hand is to determine the number of ways a string can be separated by spaces.

Test strings:

| str | len | maxSpaces | numWays | ways |
| --- | --- | --------- | ------- | ---- |
| a | 1 | 0 | 1 | a |
| ab | 2 | 1 | 2 | ab, a_b |
| abc | 3 | 2 | 4 | abc, a_bc, ab_c, a_b_c |
| abcd | 4 | 3 | 8 | abcd, a_bcd, ab_cd, abc_d, a_b_cd, ab_c_d, a_bc_d, a_b_c_d |
| abcde | 5 | 4 | 16 | abcde, a_bcde, ab_cde, abc_de, abcd_e, a_b_cde, ab_c_de, abc_d_e, a_bc_de, a_bcd_e, ab_cd_e, a_b_c_de, ab_c_d_e, a_bc_d_e, a_b_cd_e, a_b_c_d_e |

Hypothesis:

+ maxSpaces = len - 1
+ numWays = maxSpaces^2

How do I find _ways_?

```js

const str = 'foobar'

const maxSpaces = str.length - 1

const result = []

for (let n = 1; n <= maxSpaces; n++) {
  result.push(findSpaces(str, n))
}

```

How do I find all possible arrangements of spaces between characters?

__Example 1:__

```js
str = 'abc'
n = 1

// desired logic
str.replace(/^(.)/m, '$1_') // a_bc
str.replace(/^(..)/m, '$1_') // ab_c
```

__Example 2:__

```js
str = 'abc'
n = 2

// desired logic
str.replace(/^(.)(.)/m, '$1_$2_') // a_b_c
```

__Example 3:__

```js
str = 'abcde'
n = 1

// desired logic
str.replace(/^(.)/m, '$1_') // a_bcde
str.replace(/^(..)/m, '$1_') // ab_cde
str.replace(/^(...)/m, '$1_') // abc_de
str.replace(/^(....)/m, '$1_') // abcd_e
```

__Example 4:__

```js
str = 'abcde'
n = 2

// desired logic
str.replace(/^(.)(.)/m, '$1_$2_') // a_b_cde
str.replace(/^(..)(.)/m, '$1_$2_') // ab_c_de
str.replace(/^(...)(.)/m, '$1_$2_') // abc_d_e
str.replace(/^(.)(..)/m, '$1_$2_') // a_bc_de
str.replace(/^(..)(..)/m, '$1_$2_') // ab_cd_e
str.replace(/^(.)(...)/m, '$1_$2_') // a_bcd_e
```

__Example 5:__

```js
str = 'abcdef'
n = 1

// desired logic
str.replace(/^(.)/m, '$1_') // a_bcdef
str.replace(/^(..)/m, '$1_') // ab_cdef
str.replace(/^(...)/m, '$1_') // abc_def
str.replace(/^(....)/m, '$1_') // abcd_ef
str.replace(/^(.....)/m, '$1_') // abcde_f
```

__Example 6:__

```js
str = 'abcdef'
n = 2

// desired logic
str.replace(/^(.)(.)/m, '$1_$2_') // a_b_cdef
str.replace(/^(..)(.)/m, '$1_$2_') // ab_c_def
str.replace(/^(...)(.)/m, '$1_$2_') // abc_d_ef
str.replace(/^(....)(.)/m, '$1_$2_') // abcd_e_f
str.replace(/^(.)(..)/m, '$1_$2_') // a_bc_def
str.replace(/^(..)(..)/m, '$1_$2_') // ab_cd_ef
str.replace(/^(...)(..)/m, '$1_$2_') // abc_de_f
str.replace(/^(.)(...)/m, '$1_$2_') // a_bcd_ef
str.replace(/^(..)(...)/m, '$1_$2_') // ab_cde_f
str.replace(/^(.)(....)/m, '$1_$2_') // a_bcde_f
```

Try finding n = 3:

```js

str = 'abcdef'
n = 3

// desired logic
str.replace(/^(.)(.)(.)/m, '$1_$2_$3_')
str.replace(/^(..)(.)(.)/m, '$1_$2_$3_')
str.replace(/^(...)(.)(.)/m, '$1_$2_$3_')
str.replace(/^(.)(..)(.)/m, '$1_$2_$3_')
str.replace(/^(..)(..)(.)/m, '$1_$2_$3_')
str.replace(/^(.)(...)(.)/m, '$1_$2_$3_')
str.replace(/^(.)(.)(..)/m, '$1_$2_$3_')
str.replace(/^(..)(.)(..)/m, '$1_$2_$3_')
str.replace(/^(.)(..)(..)/m, '$1_$2_$3_')
str.replace(/^(.)(.)(...)/m, '$1_$2_$3_')

```

| strLen | n | combinations |
| --- | --- | --- |
| 3 | 1 | 2 |
| 3 | 2 | 1 |
| 5 | 1 | 4 |
| 5 | 2 | 6 |
| 6 | 1 | 5 |
| 6 | 2 | 10 |
| 6 | 3 | 10 |

__Possible Combinations:__

```js
const n = 3
const maxLen = 6

// [ '.', '..', '...', '....', '.....', '......' ]
Array(maxLen)
  .fill(0)
  .map((x, i) =>
    Array(i + 1)
      .fill('.')
      .join('')
  )

```

__I want to pick:__

| picks | len |
| --- | --- |
| 0 0 0 | 3 |
| 0 0 1 | 4 |
| 0 0 2 | 5 |
| 0 0 3 | 6 |
| 0 1 0 | 4 |
| 0 1 1 | 5 |
| 0 1 2 | 6 |
| 0 2 0 | 5 |
| 0 2 1 | 6 |
| 0 3 0 | 6 |
| 1 0 0 | 4 |
| 1 0 1 | 5 |
| 1 0 2 | 6 |
| 1 1 0 | 5 |
| 1 1 1 | 6 |
| 1 2 0 | 6 |
| 2 0 0 | 5 |
| 2 0 1 | 6 |
| 2 1 0 | 6 |
| 3 0 0 | 6 |

```js

const findCombinationsLessThan = (nChoices, maxLen, arr) => {
  const solutions = new Set()
  const getLen = posArr => posArr.reduce((a, v) => a + arr[v].length, 0)
  const recurse = (posArr = Array(nChoices).fill(0)) => {
    if (getLen(posArr) <= maxLen) {
      solutions.add(posArr.join(''))
      for (let i = 0; i < posArr.length; i++) {
        recurse(posArr.map((x, i2) => (i2 === i ? x + 1 : x)))
      }
    }
  }

  recurse()

  return [...solutions].sort((a, b) => +a - +b)
}

const n = 3
const maxLen = 6
const avail = Array(maxLen)
  .fill(0)
  .map((x, i) =>
    Array(i + 1)
      .fill('.')
      .join('')
  )

/*
[ '000',
  '001',
  '002',
  '003',
  '010',
  '011',
  '012',
  '020',
  '021',
  '030',
  '100',
  '101',
  '102',
  '110',
  '111',
  '120',
  '200',
  '201',
  '210',
  '300' ]
*/
findCombinationsLessThan(n, maxLen, avail)

```

___Let's convert this to a regex generator (and remove Set() trickery):___

```js

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
            match.map((x, j) => (i === j ? x.replace(/\./, '..') : x)).join('')
        )
      }
    }
  }

  recurse()

  return regStrings.map(x => RegExp(x, 'm'))
}

const n = 3
const max = 6

/*
[ /^(.)(.)(.)/m,
  /^(..)(.)(.)/m,
  /^(...)(.)(.)/m,
  /^(....)(.)(.)/m,
  /^(...)(..)(.)/m,
  /^(...)(.)(..)/m,
  /^(..)(..)(.)/m,
  /^(..)(...)(.)/m,
  /^(..)(..)(..)/m,
  /^(..)(.)(..)/m,
  /^(..)(.)(...)/m,
  /^(.)(..)(.)/m,
  /^(.)(...)(.)/m,
  /^(.)(....)(.)/m,
  /^(.)(...)(..)/m,
  /^(.)(..)(..)/m,
  /^(.)(..)(...)/m,
  /^(.)(.)(..)/m,
  /^(.)(.)(...)/m,
  /^(.)(.)(....)/m ]
*/
genRegexes(n, max)

```

__Finally, let's combine with an explosion method:__

```js
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

/*
[ 'a_b_c_defg',
  'ab_c_d_efg',
  'abc_d_e_fg',
  'abcd_e_f_g',
  'abc_de_f_g',
  'abc_d_ef_g',
  'ab_cd_e_fg',
  'ab_cde_f_g',
  'ab_cd_ef_g',
  'ab_c_de_fg',
  'ab_c_def_g',
  'a_bc_d_efg',
  'a_bcd_e_fg',
  'a_bcde_f_g',
  'a_bcd_ef_g',
  'a_bc_de_fg',
  'a_bc_def_g',
  'a_b_cd_efg',
  'a_b_cde_fg',
  'a_b_cdef_g' ]
*/
explode('abcdefg', genRegexes(3, 6))
```

Given two explosions, what are all the orderly ways I could combine them?

_abcd_: 'a_bcd', 'ab_cd', 'abc_d', 'a_b_cd', 'ab_c_d', 'a_bc_d', 'a_b_c_d'

_efg_: 'e_fg', 'ef_g', 'e_f_g'

```js
'a(e)_bcd(fg)' // insert 1, 1
'(e)a_(fg)bcd' // insert 0, 1
'a(e)_(fg)bcd' // insert 1, 0
'(e)a_bcd(fg)' // insert 0, 1

'a(ef)_bcd(g)' // insert 1, 1
'(ef)a_(g)bcd' // insert 0, 1
'a(ef)_(g)bcd' // insert 1, 0
'(ef)a_bcd(g)' // insert 0, 1

'ab(e)_cd(fg)' // insert 1, 1
'(e)ab_(fg)cd' // insert 0, 1
'ab(e)_(fg)cd' // insert 1, 0
'(e)ab_cd(fg)' // insert 0, 1

'ab(ef)_cd(g)' // insert 1, 1
'(ef)ab_(g)cd' // insert 0, 1
'ab(ef)_(g)cd' // insert 1, 0
'(ef)ab_cd(g)' // insert 0, 1

'abc(e)_d(fg)' // insert 1, 1
'e(abc)_(fg)d' // insert 0, 1
'abc(e)_(fg)d' // insert 1, 0
'e(abc)_d(fg)' // insert 0, 1

'abc(ef)_d(g)' // insert 1, 1
'(ef)abc_(g)d' // insert 0, 1
'abc(ef)_(g)d' // insert 1, 0
'(ef)abc_d(g)' // insert 0, 1
```

... This will take too long to flesh out completely.

How do I find this programmatically?

---

I think I'm going about this the wrong way. Explosion is useful for the final step- separating the combination into words.

Regardless, I need to find all possible __orderly__ combinations of two strings.

```js
const strA = 'abc'
const strB = 'DEF'

/*
Desired:

arr = [
  abcDEF,
  abDcEF,
  abDEcf,
  abDEFc,
  aDbcEF,
  aDbEcF,
  aDbEFc,
  aDEbcF,
  aDEbFc,
  aDEFbc,
  DabcEF,
  DabEcF,
  DabEFc,
  DaEbcF,
  DaEbFc,
  DaEFbc,
  DEabcF,
  DEabFc,
  DEaFbc,
  DEFabc
]

tree(b, m)
  b = 0                         // default
  m = 000111                    // default; aLen === 3; bLen === 3
  push(abcDEF)                  // conv(m)
  m = shift(b) === 001011       // pos(b) > 0; m[pos(b) - 1] !== 1
  push(abDcEF)                  // conv(m)
  tree(b+1=1, m=001011)         // pos(bLen - 1) - pos(0) > bLen - 1; b + 1 < bLen
  CONT                          // from tree(0, 2, 001101)
  m = shift(b) === 010011       // pos(b) > 0; m[pos(b) - 1] !== 1
  push(aDbcEF)                  // conv(m)
  tree(b+1=1, m=010011)         // pos(bLen - 1) - pos(0) > bLen - 1; b + 1 < bLen
  m = shift(b) === 100011
  push(DabcEF)
  tree(b+1=1, m=100011)
  CONT
  STOP

tree(1, 001011)
  m = shift(b) === 001101       // pos(b) > 0; m[pos(b) - 1] !== 1
  push(abDEcF)                  // conv(m)
  tree(b+1=2, m=001101)         // pos(bLen - 1) - pos(0) > bLen - 1; b + 1 < bLen
  CONT
  STOP                          // m[pos(b) - 1] === 1

tree(2, 001101)
  m = shift(b) === 001110       // pos(b) > 0; m[pos(b) - 1] !== 1
  push(abDEFc)                  // conv(m)
  STOP                          // pos(bLen - 1) - pos(0) === bLen - 1; b + 1 === bLen

tree(1, 010011)
  m = shift(b) === 010101
  push(aDbEcF)
  tree(b+1=2, m=010101)
  CONT
  m = shift(b) === 011001
  push(aDEbcF)
  tree(b+1=2, m=011001)
  CONT
  STOP

tree(2, 010101)
  m = shift(b) === 010110
  push(aDbEFc)
  STOP

tree(2, 011001)
  m = shift(b) === 011010
  push(aDEbFc)
  m = shift(b) === 011100
  push(aDEFbc)
  STOP

tree(1, 100011)
  m = shift(b) === 100101
  push(DabEcF)
  tree(b+1=2, 100101)
  CONT
  m = shift(b) === 101001
  push(DaEbcF)
  tree(b+1=2, 101001)
  CONT
  m = shift(b) === 110001
  push(DEabcF)
  tree(b+1=2, 110001)
  CONT
  STOP

tree(2, 100101)
  m = shift(b) === 100110
  push(DabEFc)
  STOP

tree(2, 101001)
  m = shift(b) === 101010
  push(DaEbFc)
  m = shift(b) === 101100
  push(DaEFbc)
  STOP

tree(2, 110001)
  m = shift(b) === 110010
  push(DEabFc)
  m = shift(b) === 110100
  push(DEaFbc)
  m = shift(b) === 111000
  push(DEFabc)
  STOP
*/

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

recurse('ab', 'c')

recurse('abc', 'DEF')

```

That's all I need to find all possibilities! Time to combine all of these into index.js.

---

Regex-based explosions generation needs optimization (I should avoid regex completely).

I'll leave this for now and write another solution later.
