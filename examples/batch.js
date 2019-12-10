const batch = require('../src/batch')

const files = 'fixtures/test-content/**'

;(async () => {
  const postTitles = await batch(files, 1, async ({ goods, index, delay }) => {
    // Do stuff to the data coming from the files.
    return index + ': ' + goods.data.title
  })

  console.log(postTitles)
})()
