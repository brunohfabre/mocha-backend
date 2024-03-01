function randomString(length: number) {
  let result = ''

  const characters = 'abcdefghijklmnopqrstuvwxyz'

  let counter = 0

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
    counter += 1
  }

  return result
}

export function generateCode() {
  const code = `${randomString(5)}-${randomString(5)}-${randomString(5)}`

  return code
}
