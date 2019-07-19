const trash = require('trash')

const remove = async (path, options = {}) => {
  try {
    await trash(path, options)
  } catch (error) {
    console.error(error)
  }
}

module.exports = remove
