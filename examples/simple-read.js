const { read } = require('../index')

// Asynchronously
;(async () => {
  const fileContents = await read(
    './fixtures/test-content/articles/kitchen-nightmares.md'
  )

  console.log(fileContents)
})()

// Or sync, if you prefer.
// Notice that the `sync` method adds the file as a buffer in
// `fileContents.orig`.
const fileContents = read.sync(
  './fixtures/test-content/articles/kitchen-nightmares.md'
)

console.log(fileContents)
