const update = require('immutability-helper')
const eachOf = require('async/eachOf')
const eachOfLimit = require('async/eachOfLimit')
const glob = require('glob')
const write = require('../write')
const readFile = require('../../helpers/read-file')
const getPath = require('../../helpers/get-path')
const isMarkdownFile = require('../../helpers/is-markdown-file')
const remove = require('../remove')

const bulkEdit = (globPattern, onEach, limit = 5, afterAll) => {
  if (!globPattern) {
    return
  }

  if (typeof onEach !== 'function') {
    throw new Error('The onEach callback must be a function')
  }

  const files = glob.sync(globPattern).filter(isMarkdownFile)

  const iteratee = async (path, index, callback) => {
    try {
      const goods = await readFile(getPath(path))
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
    if (error) throw new Error(error)

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

module.exports = bulkEdit
