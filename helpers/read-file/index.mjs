import matter from 'gray-matter'
import getPath from '../../helpers/get-path/index.mjs'

/**
 * Reads the contents of a markdown file.
 *
 * @param {string} file Where to read the data from
 * @param {object} options Options for gray-matter's read method
 */
const readFile = (file, options = {}) => {
  const path = getPath(file)

  try {
    return matter.read(path, options)
  } catch (error) {
    console.error(error)
  }
}

export default readFile
