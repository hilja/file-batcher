const { bulkEdit } = require('..')

const onEach = async ({ goods, actions }) => {
  const { author } = goods.data
  const { update, save } = actions

  if (!author) return

  // Update the author name with the provided immutability-helper, it gives
  // you a nice syntax for updating complex shapes. The update function is
  // prepopulated with the data (goods) from the post, so you don't have to.
  const newData = update({
    data: { author: { $set: 'Slartibartfast' } }
  })

  // At the end you can save your post with the new data
  await save(newData)
  console.log('Just saved:', goods.path)
}

// It's a simple operation, no need to limit it
bulkEdit('fixtures/test-content/**', onEach)
