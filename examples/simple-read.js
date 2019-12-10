const { read } = require('../index')

;(async () => {
  const fileContents = await read(
    './fixtures/test-content/articles/kitchen-nightmares.md'
  )

  console.log(fileContents)
})()
