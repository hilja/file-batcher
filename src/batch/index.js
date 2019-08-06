const fs = require('fs')
const path = require('path')
const update = require('immutability-helper')
const mapLimit = require('async/mapLimit')
const glob = require('glob')
const getPath = require('../../helpers/get-path')
const read = require('../read')
const remove = require('../remove')
const write = require('../write')

const isFile = path => fs.lstatSync(path).isFile()

const sleep = async time =>
  new Promise(resolve => setTimeout(() => resolve(), time))

/**
 * Takes a glob patterns or an array of paths and asynchronously iterates it
 * over, executing the `onEach` function on every run.
 *
 * @param {string|array} input Glob string or an array of file paths.
 * @param {int|Infinity} limit Limit the concurrent run of the async iterator.
 * @param {function} onEach A function to execute of each iteration.
 */
const batch = async (input, limit = 1, onEach) => {
  if (typeof onEach !== 'function') {
    throw new Error('The onEach callback must be a function')
  }

  const files = Array.isArray(input)
    ? input.map(getPath).filter(isFile)
    : glob.sync(getPath(input)).filter(isFile)
  let index = 0

  try {
    return mapLimit(files, limit, async file => {
      const actions = {
        update: target => update(goods, target),
        save: async (data, path = file) => write(path, data),
        remove: async (path = file) => remove(path),
        rename: (newPath, oldPath = file) =>
          fs.renameSync(getPath(oldPath), path.join(dirname, newPath)),
        mapLimit
      }
      const dirname = path.dirname(file)
      const goods = await read(file)
      index++

      return onEach({ actions, files, goods, index, sleep })
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = batch
