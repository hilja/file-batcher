const fs = require('fs')
const path = require('path')
const update = require('immutability-helper')
const pMap = require('p-map')
const glob = require('glob')
const delay = require('delay')
const getPath = require('../../helpers/get-path')
const read = require('../read')
const remove = require('../remove')
const write = require('../write')

const isFile = path => fs.lstatSync(path).isFile()

/**
 * Takes a glob patterns or an array of paths and asynchronously iterates it
 * over, executing the `onEach` function on every run.
 *
 * @param {String|String[]} input Glob string or an array of file paths.
 * @param {Int|Infinity} limit Limit the concurrent run of the async iterator.
 * @param {Function} onEach A function to execute of each iteration.
 * @returns {Promise}
 */
const batch = async (input, limit = Infinity, onEach) => {
  if (typeof input === 'undefined') {
    return undefined
  }

  const files = Array.isArray(input)
    ? input.map(getPath).filter(isFile)
    : glob.sync(getPath(input)).filter(isFile)
  const options = { concurrency: limit }

  try {
    return pMap(
      files,
      async (file, index) => {
        const dirname = path.dirname(file)
        const goods = await read(file)
        const actions = {
          update: target => update(goods, target),
          save: async (data, path = file, options) =>
            write(path, data, options),
          remove: async (path = file) => remove(path),
          rename: (newPath, oldPath = file) => {
            newPath = path.isAbsolute(newPath)
              ? newPath
              : path.join(dirname, newPath)
            fs.renameSync(getPath(oldPath), newPath)
          },
          pMap
        }

        return typeof onEach === 'function'
          ? onEach({ actions, files, goods, index, delay })
          : goods
      },
      options
    )
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = batch
