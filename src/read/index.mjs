import glob from 'glob'
import isMarkdownFile from '../../helpers/is-markdown-file/index.mjs'
import readFile from '../../helpers/read-file/index.mjs'
import getPath from '../../helpers/get-path/index.mjs'

/**
 * Reads a directory, multiple directories, single file, or multiple single
 * markdown files and returns their content in JSON parsed my gray-matter.
 *
 * @param {string|array} location Path to the file or folder.
 */
const read = async globPattern => {
  const files = glob.sync(globPattern)

  try {
    const handledFiles = await Promise.all(files.map(_handleFile))
    const allFiles = handledFiles.filter(Boolean)

    return allFiles.flat()
  } catch (error) {
    console.error(error)
  }
}

const _handleFile = file => {
  const path = getPath(file)

  return isMarkdownFile(path) ? readFile(path) : undefined
}

export default read
