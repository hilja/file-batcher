const batch = require('../src/batch')

const files = 'fixtures/test-content/**'

// const results = batch(files, 1, async ({ goods, index, delay }) => {
//   // await delay(1000)
//   console.log(goods.data.title)

//   return goods

//   // return goods.data.title + ' ' + index
// })

// const testFunc = async () => {
//   const results = await batch(files, 1, async ({ goods, index, delay }) => {
//     return goods
//   })

//   console.log(results)
// }

// testFunc()

;(async () => {
  const foo = await batch(files)

  console.log(foo)
})()

// console.log(results)

// results
//   .then(data => {
//     console.log(data)
//   })
//   .catch(error => console.error(error))
