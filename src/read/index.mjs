import isMarkdownFile from '../../helpers/is-markdown-file/index.mjs'
import readFile from '../../helpers/read-file/index.mjs'
import readDirectory from '../../helpers/read-directory/index.mjs'
import getPath from '../../helpers/get-path/index.mjs'

/**
 * Reads a directory, multiple directories, single file, or multiple single
 * markdown files and returns their content in JSON parsed my gray-matter.
 *
 * @param {string|array} location Path to the file or folder.
 */
const read = async locations => {
  const isMultiple = Array.isArray(locations)

  try {
    return isMultiple
      ? Promise.all(locations.map(_handleFile))
      : _handleFile(locations)
  } catch (error) {
    console.error(error)
  }
}

const _handleFile = location => {
  const path = getPath(location)

  return isMarkdownFile(path) ? readFile(path) : readDirectory(path)
}

export default read
