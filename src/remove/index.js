const trash = require('trash')

/**
 * Moves a file to trash.
 *
 * @param {String} path The path to trash.
 * @param {Object} options Options passed to `trash`.
 */
const remove = async (path, options = {}) => {
  try {
    await trash(path, options)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = remove
