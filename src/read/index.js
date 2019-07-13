const glob = require('glob')
const isMarkdownFile = require('../../helpers/is-markdown-file')
const readFile = require('../../helpers/read-file')
const getPath = require('../../helpers/get-path')

/**
 * Reads a directory, multiple directories, single file, or multiple single
 * markdown files and returns their content in JSON parsed my gray-matter.
 *
 * @param {string|array} location Path to the file or folder.
 */
const read = async globPattern => {
  const files = glob.sync(globPattern)

  try {
    const parsedFiles = await Promise.all(_handleFiles(files))

    return parsedFiles
  } catch (error) {
    console.error(error)
  }
}

const readSync = globPattern => {
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

module.exports = read
module.exports.sync = readSync
