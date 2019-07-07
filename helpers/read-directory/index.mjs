import fs from 'fs'
import path from 'path'
import readFile from '../read-file/index.mjs'
import getPath from '../get-path/index.mjs'
import isMarkdownFile from '../is-markdown-file/index.mjs'
import { promisify } from 'util'

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

export default readDirectory
