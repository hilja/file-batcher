import path from 'path'

/**
 * Gets an absolute path to the current working directory.
 *
 * @param {string} file Path to a file or folder
 */
const getPath = file => {
  if (!file) {
    return ''
  }

  return path.isAbsolute(file) ? file : path.join(process.env.PWD, file)
}

export default getPath
