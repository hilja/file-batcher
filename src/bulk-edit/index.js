const write = require('../write')
const read = require('../read')
const remove = require('../remove')
const update = require('immutability-helper')

const bulkEdit = (globPattern, callback) => {
  const allData = read.sync(globPattern)

  return allData.map((goods, index, originalArray) => {
    const actions = {
      save: write.sync(goods.path),
      update: target => update(goods, target),
      remove: path => remove(path || goods.path)
    }
    const args = { goods, actions, index, originalArray }

    return callback(args)
  })
}

module.exports = bulkEdit
