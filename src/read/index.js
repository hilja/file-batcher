const fs = require('fs')
const { promisify } = require('util')
const matter = require('gray-matter')
const getPath = require('../../helpers/get-path')

const readFile = promisify(fs.readFile)

/**
 * Reads the contents of a markdown file asynchronously.
 *
 * @param {string} file Where to read the data from
 * @param {object} options Options for `fs.readFile`
 */
const read = async (file, options = {}) => {
  const DEFAULTS = { encoding: 'utf8' }
  const path = getPath(file)

  try {
    const contents = await readFile(path, { ...DEFAULTS, ...options })
    const contentAsObject = matter(contents)

    // The `matter.read()` method adds the path to the object, but we're not
    // using it, so let's add it.
    contentAsObject.path = path

    return contentAsObject
  } catch (error) {
    console.error(error)
  }
}

/**
 * Reads the contents of a markdown file synchronously.
 *
 * @param {string} file Where to read the data from
 * @param {object} options Options for `fs.readFile`
 */
const readSync = (file, options = {}) => {
  const DEFAULTS = { encoding: 'utf8' }
  const path = getPath(file)

  try {
    const contents = fs.readFileSync(path, { ...DEFAULTS, ...options })
    const contentAsObject = matter(contents)

    // The `matter.read()` method adds the path to the object, but we're not
    // using it, so let's add it.
    contentAsObject.path = path

    return matter.read(path, options)
  } catch (error) {
    console.error(error)
  }
}

module.exports = read
module.exports.sync = readSync
