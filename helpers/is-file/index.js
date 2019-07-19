const fs = require('fs')

const isFile = path => {
  return fs.lstatSync(path).isFile()
}

module.exports = isFile
