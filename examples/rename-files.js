const { bulkEdit } = require('../index')

const FILE_TO_RENAME = 'fixtures/test-content/articles/test-file-md'

const renameFiles = async ({ actions }) => {
  // Rename the wrongly names file.
  await actions.rename('test-file.md')
}

bulkEdit(FILE_TO_RENAME, renameFiles)
