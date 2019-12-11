const fs = require('fs')
const { promisify } = require('util')
const matter = require('gray-matter')
const get = require('lodash.get')
const getPath = require('../../helpers/get-path')

const writeFile = promisify(fs.writeFile)

/**
 * Writes asynchronously JSON into a markdown file.
 *
 * @param {String} file File path to write.
 * @param {Object|any} data What to write. A shape that looks Front Matter is stringified into Front Matter.
 * @param {Object|String} options.writeFile Options for `fs.writeFile`.
 * @param {Object} options.stringify Options for gray-matter's stringify method.
 * @param {Object} options.writeFile Options for Node’s `writeFile` method.
 */
const write = async (file, data, options = {}) => {
  if (!file) {
    return
  }

  const path = getPath(file)
  const opts = _getOptions(options)

  // If the data looks like Front Matter, then stringify it.
  if (_looksLikeFrontMatter(data)) {
    data = _stringify(data, opts.stringify)
  }

  try {
    await writeFile(path, data, opts.writeFile)
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
