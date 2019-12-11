const path = require('path')

/**
 * Gets an absolute path to the current working directory.
 *
 * @param {String} file Path to a file or folder.
 * @returns {String}
 */
const getPath = file => {
  if (!file) return ''

  try {
    return path.isAbsolute(file) ? file : path.resolve(process.env.PWD, file)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = getPath
