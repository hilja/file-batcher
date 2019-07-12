import trash from 'trash'

const remove = async (path, options = {}) => {
  await trash(path, options)
}

export default remove
