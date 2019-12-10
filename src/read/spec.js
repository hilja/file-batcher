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
        'foo.md': markdown,
        'bar.md': 'foo'
      }
    })
  })

  test('should read a file and parse its contents into an object', async () => {
    const actual = await read(path + '/foo.md')
    const expected = markdownJSON()

    expect(actual).toEqual(expected)
  })

  test('should read a non Front Matter file', async () => {
    const actual = await read(path + '/bar.md')
    const expected = 'foo'

    expect(actual).toEqual(expected)
  })
})
