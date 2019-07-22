const fs = require('fs')
const path = require('path')
const update = require('immutability-helper')
const eachOf = require('async/eachOf')
const eachOfLimit = require('async/eachOfLimit')
const glob = require('glob')
const read = require('../read')
const write = require('../write')
const getPath = require('../../helpers/get-path')
const remove = require('../remove')

/**
 * Take a glob patterns  and iterates over an array of paths, executing the
 * asynchronous `onEach` function on every iteration.
 *
 * @param {string} globPattern A glop pattern. Uses [`glob`]{@link https://npmjs.com/package/glob}.
 * @param {function} onEach A iterator function to run on each item.
 * @param {function} afterAll A function to execute after the loop has finished.
 * @param {int} limit Limit the concurrent runs fn the async iterator.
 */
const bulkEdit = (globPattern, onEach, afterAll, limit) => {
  if (!globPattern) {
    return
  }

  if (typeof onEach !== 'function') {
    throw new Error('The onEach callback must be a function')
  }

  const files = glob.sync(getPath(globPattern)).filter(_isFile)

  const iteratee = async (filePath, index, callback) => {
    try {
      const goods = await read(filePath)
      const dirname = path.dirname(filePath)
      const actions = {
        update: target => update(goods, target),
        save: async (data, path = filePath) => write(path, data),
        remove: async (path = filePath) => remove(path),
        rename: (newPath, oldPath = filePath) =>
          fs.renameSync(getPath(oldPath), path.join(dirname, newPath))
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

  return limit
    ? eachOfLimit(
        files,
        limit,
        (path, index, callback) => iteratee(path, index, callback),
        done
      )
    : eachOf(
        files,
        (path, index, callback) => iteratee(path, index, callback),
        done
      )
}

const _isFile = path => fs.lstatSync(path).isFile()

module.exports = bulkEdit
