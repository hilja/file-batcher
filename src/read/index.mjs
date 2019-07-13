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
export const read = async globPattern => {
  const files = glob.sync(globPattern)

  try {
    const parsedFiles = await Promise.all(_handleFiles(files))

    return parsedFiles
  } catch (error) {
    console.error(error)
  }
}

export const readSync = globPattern => {
  const files = glob.sync(globPattern)

  try {
    return _handleFiles(files)
  } catch (error) {
    console.error(error)
  }
}

const _handleFiles = files =>
  files
    .map(_handleFile)
    .filter(Boolean)
    .flat()

const _handleFile = file =>
  isMarkdownFile(getPath(file)) ? readFile(getPath(file)) : undefined

export default read
