const { batch } = require('..')

batch('fixtures/test-content/**', 1, async ({ goods, actions }) => {
  const { author } = goods.data
  const { update, save } = actions

  if (author !== 'Gordon Ramsey') return

  // Update the author name with the provided immutability-helper, it gives
  // you a nice syntax for updating complex shapes. The update function is
  // prepopulated with the data (goods) from the post, so you don't have to.
  const newData = update({
    data: { author: { $set: 'Jamie Oliver' } }
  })

  // You can just as well mutate the original object, if you like ¯\_(ツ)_/¯
  // goods.data.author = 'Jamie Oliver'

  // At the end you can save your post with the new data
  await save(newData)

  console.log('Just saved:', goods.path)
})
