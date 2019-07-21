const hasFileExtension = (string, pattern) => {
  const regex = new RegExp(pattern + '$', 'i')

  return regex.test(string)
}

module.exports = hasFileExtension
