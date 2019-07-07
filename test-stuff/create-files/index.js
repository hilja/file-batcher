import path from 'path'
import mkdirp from 'mkdirp'

const mockFiles = (files, dirPath, fs) => {
  for (const key in files) {
    const entry = files[key]

    if (entry == null || typeof entry === 'string') {
      fs.writeFileSync(path.join(dirPath, key), entry || '')
    } else {
      const subDirPath = path.join(dirPath, key)
      mkdirp.sync(subDirPath)
      mockFiles(entry, subDirPath, fs)
    }
  }
}

const createFiles = fs => (files, dirPath = '/') => {
  return mockFiles(files, dirPath, fs)
}

export default createFiles
