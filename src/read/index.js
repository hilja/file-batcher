const fs = require('fs')
const { promisify } = require('util')
const matter = require('gray-matter')
const getPath = require('../../helpers/get-path')

const readFile = promisify(fs.readFile)

/**
 * Reads the contents of a markdown file asynchronously.
 *
 * @param {String} file Where to read the data from
 * @param {Object} options Options for `fs.readFile`
 * @returns {Promise{}}
 */
const read = async (file, options = {}) => {
  const DEFAULTS = { encoding: 'utf8' }
  const path = getPath(file)

  try {
    const rawContents = await readFile(path, { ...DEFAULTS, ...options })
    const isFrontMatter = matter.test(rawContents)

    if (!isFrontMatter) {
      return rawContents
    }

    const content = matter(rawContents)

    // The `matter.read()` method adds the path to the object, but we're not
    // using it, so let's add it.
    content.path = path
    delete content.orig

    return content
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = read
