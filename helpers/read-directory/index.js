const fs = require('fs')
const path = require('path')
const readFile = require('../read-file')
const getPath = require('../get-path')
const isMarkdownFile = require('../is-markdown-file')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

/**
 * Read the files in a directory asynchronously and parse their contents into
 * JSON.
 *
 * @param {string} directory Path to the directory.
 */
const readDirectory = async directory => {
  directory = getPath(directory)

  try {
    const files = await readdir(directory)

    return files.map(file => _handleFile(directory, file)).filter(Boolean)
  } catch (error) {
    console.error(error)
  }
}

const _handleFile = (directory, file) => {
  const filePath = path.resolve(directory, file)

  return isMarkdownFile(filePath) && readFile(filePath)
}

module.exports = readDirectory
