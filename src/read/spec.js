const fs = require('fs')
const read = require('./')
const {
  path,
  path2,
  markdown,
  markdownJSON
} = require('../../test-stuff/test-fixtures')
const createFiles = require('../../test-stuff/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('read:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      [path]: {
        'foo.md': markdown,
        'bar.md': markdown
      },
      [path2]: {
        'foo.md': markdown,
        'bar.md': markdown
      }
    })
  })

  it('should read a folder of files asynchronously', async () => {
    const actual = await read(path + '/*')
    const expected = [markdownJSON('bar.md'), markdownJSON()]

    expect(actual).toEqual(expected)
  })

  it('should read a single file asynchronously', async () => {
    const actual = await read(path + '/foo.md')
    const expected = [markdownJSON()]

    expect(actual).toEqual(expected)
  })

  it('should read a folder of files synchronously', () => {
    const actual = read.sync(path + '/*')
    const expected = [markdownJSON('bar.md'), markdownJSON()]

    expect(actual).toEqual(expected)
  })
})
