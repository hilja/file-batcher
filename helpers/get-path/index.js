const path = require('path')

/**
 * Gets an absolute path to the current working directory.
 *
 * @param {string} file Path to a file or folder
 */
const getPath = file => {
  if (!file) {
    return ''
  }

  return path.isAbsolute(file) ? file : path.resolve(process.env.PWD, file)
}

module.exports = getPath
