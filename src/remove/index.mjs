import trash from 'trash'

const remove = async (path, options = {}) => {
  const defaults = { glob: true }

  await trash(path, { ...defaults, ...options })
}

export default remove
