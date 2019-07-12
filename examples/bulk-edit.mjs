import { bulkEdit } from '../index.js'

const allArticles = bulkEdit('test-stuff/test-content/**')

;(async () => {
  await allArticles(({ goods, actions }) => {
    // Grab the tools you need
    const { update, save } = actions
    // And the goods you're going to use
    const { author } = goods.data

    if (author) {
      // Update the author name with the provided immutability-helper, it gives
      // you a nice syntax for updating complex shapes. The update function is
      // prepopulated with the data (goods) from the post, so you don't have to.
      const newData = update({
        data: { author: { $set: 'Slartibartfast' } }
      })

      // At the end you can save your post with the new data
      save(newData)
    }
  })
})()
