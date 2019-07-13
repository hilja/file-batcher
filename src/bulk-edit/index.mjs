import { writeSync } from '../write/index.mjs'
import { readSync } from '../read/index.mjs'
import remove from '../remove/index.mjs'
import update from 'immutability-helper'

const bulkEdit = (globPattern, callback) => {
  const allData = readSync(globPattern)

  return allData.map((goods, index, originalArray) => {
    const actions = {
      save: writeSync(goods.path),
      update: target => update(goods, target),
      remove: path => remove(path || goods.path)
    }
    const args = { goods, actions, index, originalArray }

    return callback(args)
  })
}

export default bulkEdit
