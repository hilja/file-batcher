const update = require('immutability-helper')
const eachOf = require('async/eachOf')
const eachOfLimit = require('async/eachOfLimit')
const glob = require('glob')
const read = require('../read')
const write = require('../write')
const getPath = require('../../helpers/get-path')
const isMarkdownFile = require('../../helpers/is-markdown-file')
const remove = require('../remove')

/**
 *
 * @param {string} globPattern A glop pattern, uses `glob`
 * @param {function} onEach A iterator function to run on each item
 * @param {function} afterAll A function to execute after the loop has finished
 * @param {object|int} opts If int, then it's used as a limit the async iterator
 * @param {int} opts.limit Limit the concurrent runs on the async iterator
 * @param {boolean} opts.onlyMdFiles Should other files types be read
 */
const bulkEdit = (globPattern, onEach, afterAll, opts) => {
  if (!globPattern) {
    return
  }

  if (typeof onEach !== 'function') {
    throw new Error('The onEach callback must be a function')
  }

  const optsIsNum = typeof opts === 'number'
  const DEFAULTS = {
    // If opts is number then just use it
    limit: optsIsNum ? opts : 5,
    onlyMdFiles: true
  }
  const options = { ...DEFAULTS, ...(!optsIsNum ? opts : {}) }

  const files = glob
    .sync(getPath(globPattern))
    .filter(file => (options.onlyMdFiles ? isMarkdownFile(file) : file))

  const iteratee = async (path, index, callback) => {
    try {
      const goods = await read(path)
      const actions = {
        save: data => write(goods.path, data),
        update: target => update(goods, target),
        remove: path => remove(path || goods.path)
      }
      const args = { goods, actions, index }

      return callback(null, await onEach(args))
    } catch (error) {
      callback(error)
    }
  }

  // This runs after the map has completed and handles possible errors.
  const done = error => {
    if (error) {
      console.error(error)
      return
      // throw new Error(error)
    }

    if (typeof afterAll === 'function') {
      return afterAll()
    }
  }

  return options.limit
    ? eachOfLimit(
        files,
        options.limit,
        (path, index, callback) => iteratee(path, index, callback),
        done
      )
    : eachOf(
        files,
        (path, index, callback) => iteratee(path, index, callback),
        done
      )
}

module.exports = bulkEdit
