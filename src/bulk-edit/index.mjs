import { writeSync } from '../write/index.mjs'
import read from '../read/index.mjs'
import update from 'immutability-helper'

const bulkEdit = async (locations, callback) => {
  const allData = await read(locations)

  return allData.map((goods, index, originalArray) => {
    const actions = {
      save: writeSync(goods.path),
      update: target => update(goods, target)
    }
    const args = { goods, actions, index, originalArray }

    return callback(args)
  })
}

export default bulkEdit
