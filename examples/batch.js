const batch = require('../src/batch')

const files = 'fixtures/test-content/**'

const results = batch(files, 1, async ({ goods, index, sleep }) => {
  await sleep(1000)
  console.log(goods.data.title)

  return goods.data.title + ' ' + index
})

results
  .then(data => {
    console.log(data)
  })
  .catch(error => console.error(error))
