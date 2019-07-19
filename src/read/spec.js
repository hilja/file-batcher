const fs = require('fs')
const read = require('.')
const { path, markdown, markdownJSON } = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('read:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      [path]: {
        'foo.md': markdown
      }
    })
  })

  it('should read a file and parse its contents into an object', async () => {
    const actual = await read(path + '/foo.md')
    const expected = markdownJSON()

    expect(actual).toEqual(expected)
  })

  describe('.sync:', () => {
    it('should read a file and parse its contents into an object', () => {
      const actual = read.sync(path + '/foo.md')
      const expected = markdownJSON()

      expect(actual).toEqual(expected)
    })
  })
})
