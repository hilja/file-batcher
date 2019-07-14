const fs = require('fs')
const { promisify } = require('util')
const matter = require('gray-matter')
const getPath = require('../../helpers/get-path')

const readFile = promisify(fs.readFile)

const readMdFile = async (file, options = {}) => {
  const DEFAULTS = { encoding: 'utf8' }
  const path = getPath(file)
  const contents = await readFile(path, { ...DEFAULTS, ...options })
  const contentAsObject = matter(contents)

  // The `matter.read()` method adds the path to the object, but we're not using
  // it here so we need to add it.
  contentAsObject.path = path

  return contentAsObject
}

/**
 * Reads the contents of a markdown file.
 *
 * @param {string} file Where to read the data from
 * @param {object} options Options for gray-matter's read method
 */
const readMdFileSync = (file, options = {}) => {
  const path = getPath(file)

  try {
    return matter.read(path, options)
  } catch (error) {
    console.error(error)
  }
}

module.exports = readMdFile
module.exports.sync = readMdFileSync
