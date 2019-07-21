const update = require('immutability-helper')
const eachOf = require('async/eachOf')
const eachOfLimit = require('async/eachOfLimit')
const glob = require('glob')
const read = require('../read')
const write = require('../write')
const hasFileExtension = require('../../helpers/has-file-extension')
const getPath = require('../../helpers/get-path')
const isFile = require('../../helpers/is-file')
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
    // If `opts` is number then just use it.
    limit: optsIsNum ? opts : 5,
    // This is the opinionated bit about this lib.
    fileExtension: '.md|.markdown'
  }
  const OPTIONS = { ...DEFAULTS, ...(!optsIsNum ? opts : {}) }

  const files = glob.sync(getPath(globPattern)).filter(file =>
    // If it's a function, then just chug it straight into filter, gives a high
    // level of control fo the user, and such.
    OPTIONS.fileExtension === 'function'
      ? OPTIONS.fileExtension(file)
      : hasFileExtension(file, OPTIONS.fileExtension) && isFile(file)
  )

  const iteratee = async (path, index, callback) => {
    try {
      const goods = await read(path)
      const actions = {
        update: target => update(goods, target),
        save: async data => write(goods.path, data),
        remove: async path => remove(path || goods.path)
      }
      const args = { goods, actions, index, files }

      return callback(null, await onEach(args))
    } catch (error) {
      callback(error)
    }
  }

  // This runs after the map has completed and handles possible errors.
  const done = error => {
    if (error) {
      return console.error(error)
    }

    if (typeof afterAll === 'function') {
      return afterAll()
    }
  }

  return OPTIONS.limit
    ? eachOfLimit(
        files,
        OPTIONS.limit,
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
