import fs from 'fs'
import { promisify } from 'util'
import matter from 'gray-matter'
import get from 'lodash.get'
import getPath from '../../helpers/get-path/index.mjs'

const writeFile = promisify(fs.writeFile)

/**
 * Writes synchronously JSON into a markdown file.
 *
 * @param {string} file Where to write.
 * @param {object} data What to write.
 * @param {object|string} options.writeFile Options for `fs.writeFile`
 * @param {object} options.stringify Options for gray-matter's stringify method
 */
export const writeSync = (file, data, options = {}) => {
  const opts = _getOptions(options)
  const path = getPath(file)

  try {
    fs.writeFileSync(path, _stringify(data, opts.stringify), opts.writeFile)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Writes asynchronously JSON into a markdown file.
 *
 * @param {string} file Where to write.
 * @param {object} data What to write.
 * @param {object|string} options.writeFile Options for `fs.writeFile`
 * @param {object} options.stringify Options for gray-matter's stringify method
 */
export const write = async (file, data, options = {}) => {
  const opts = _getOptions(options)
  const path = getPath(file)

  try {
    await writeFile(path, _stringify(data, opts.stringify), opts.writeFile)
  } catch (error) {
    console.error(error)
  }
}

const _stringify = (input, options) => {
  const content = get(input, 'content', '')
  const data = get(input, 'data', {})

  return matter.stringify(content, data, options)
}

const _getOptions = options => ({
  writeFile: options.writeFile || 'utf8',
  stringify: { ...options.stringify }
})
