const solve = (n, sum = 0) => {
  sum += n % 10
  n -= n % 10
  n /= 10
  if (n >= 10) {
    return solve(n, sum)
  } else {
    sum += n
    if (sum >= 10) {
      return solve(sum)
    } else {
      return sum
    }
  }
}

console.log('Find the digital root of 1073741824 without string operations.')

console.log('\nDigital Root: ' + solve(1073741824))