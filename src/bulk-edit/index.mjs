import { writeSync } from '../write/index.mjs'
import read from '../read/index.mjs'

const bulkEdit = locations => async callback => {
  const allData = await read(locations)

  return allData.map(goods => {
    const actions = { save: writeSync(goods.path) }
    const args = { goods, actions }

    return callback(args)
  })
}

export default bulkEdit
