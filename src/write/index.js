const fs = require('fs')
const { promisify } = require('util')
const matter = require('gray-matter')
const get = require('lodash.get')
const getPath = require('../../helpers/get-path')

const writeFile = promisify(fs.writeFile)

/**
 * Writes asynchronously JSON into a markdown file.
 *
 * @param {string} file Where to write.
 * @param {object|any} data What to write. A shape that looks Front Matter is stringified into Front Matter.
 * @param {object|string} options.writeFile Options for `fs.writeFile`
 * @param {object} options.stringify Options for gray-matter's stringify method
 */
const write = async (file, data, options = {}) => {
  if (!file) {
    return
  }

  const path = getPath(file)
  const opts = _getOptions(options)

  // If data looks like data Front Matter type of data, then stringify on it.
  if (_looksLikeFrontMatter(data)) {
    data = _stringify(data, opts.stringify)
  }

  try {
    await writeFile(path, data, opts.writeFile)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Writes synchronously JSON into a markdown file.
 *
 * @param {string} file Where to write.
 * @param {object|any} data What to write. A shape that looks Front Matter is stringified into Front Matter.
 * @param {object|string} options.writeFile Options for `fs.writeFile`
 * @param {object} options.stringify Options for gray-matter's stringify method
 */
const writeSync = (file, data, options = {}) => {
  if (!file) {
    return
  }

  const path = getPath(file)
  const opts = _getOptions(options)

  // If data looks like data Front Matter type of data, then stringify on it.
  if (_looksLikeFrontMatter(data)) {
    data = _stringify(data, opts.stringify)
  }

  try {
    fs.writeFileSync(path, data, opts.writeFile)
  } catch (error) {
    console.error(error)
  }
}

const _looksLikeFrontMatter = (obj = {}) =>
  typeof obj.content === 'string' && typeof obj.data === 'object'

const _stringify = (input, options) => {
  const content = get(input, 'content', '')
  const data = get(input, 'data', {})

  return matter.stringify(content, data, options)
}

const _getOptions = options => ({
  writeFile: options.writeFile || 'utf8',
  stringify: { ...options.stringify }
})

module.exports = write
module.exports.sync = writeSync
