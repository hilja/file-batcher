const { bulkEdit } = require('..')

const onEach = async ({ actions }) => {
  const { update, save } = actions

  // Something async here, fetch or whatever...
  const fakeFetch = new Promise(resolve => {
    setTimeout(() => resolve('<something-from-an-api>'), 1000)
  })

  // Wait for it
  const dataFromAPI = await fakeFetch

  // Stuff it in to the post. Update is sync, btw.
  const newData = update({
    data: { foo: { $set: dataFromAPI } }
  })

  // And save it. Save is async.
  try {
    await save(newData)
  } catch (error) {
    console.error(error)
  }
  console.log('Just saved this thing:', newData)
}

const afterAll = () => console.log('All done!')

// Do it, say, 2 files at the time. Tweak it so you don't get rate-limited.
bulkEdit('fixtures/test-content/**', onEach, 2, afterAll)
