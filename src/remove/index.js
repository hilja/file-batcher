const trash = require('trash')

const remove = async (path, options = {}) => {
  await trash(path, options)
}

module.exports = remove
