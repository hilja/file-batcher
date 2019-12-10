const { batch } = require('../index')

const FILE_TO_RENAME = 'fixtures/test-content/articles/test-file-md'

batch(FILE_TO_RENAME, 1, async ({ actions }) => {
  // Rename the wrongly names file.
  await actions.rename('test-file.md')
})
