// import glob from 'glob'
import { bulkEdit } from '../index.js'

// const foo = glob.sync('test-stuff/test-content/**')

const allPosts = bulkEdit('test-stuff/test-content/**')

;(async () => {
  await allPosts(({ goods, actions }) => {
    const { date } = goods.data
    // goods.data.date = date + ' foo'
    // goods.data.date = date.replace(' foo', '')
    goods.data.date = date.trim()

    actions.save(goods)

    console.log(goods)
  })
})()
