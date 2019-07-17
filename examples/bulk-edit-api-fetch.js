const { bulkEdit } = require('..')

const onEach = async ({ actions }) => {
  const { update, save } = actions

  // Something async here, fetch or whatever...
  const fakeFetch = new Promise(resolve => {
    setTimeout(() => resolve('<something-from-an-api>'), 1000)
  })

  // Wait for it
  const dataFromAPI = await fakeFetch

  // Stuff it in to the post. Update is sync.
  const newData = update({
    data: { foo: { $set: dataFromAPI } }
  })

  // And save it. Save is async.
  await save(newData)
  console.log('Just saved this thing \n', newData)
}

const afterAll = () => console.log('All done!')

// Do it two files at the time
bulkEdit('fixtures/test-content/**', onEach, 2, afterAll)
