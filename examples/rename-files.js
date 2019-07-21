const { bulkEdit } = require('../index')

const renameFiles = async ({ actions }) => {
  await actions.rename('test-file.md')
}

bulkEdit('fixtures/test-content/articles/test-file-md', renameFiles)
