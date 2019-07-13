const write = require('./')
const path = require('path')
const fs = require('fs')
const { path: mockPath, markdown } = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())
const ERROR_MESSAGE =
  "The data you gave is not the right shape. e.g.: {data: {}, content: ''}"

const MOCK_JSON = {
  content: 'Hello\n',
  data: {
    title: 'foo',
    description: 'bar',
    categories: ['images', 'birds']
  }
}

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('write:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({ [mockPath]: {} })
  })

  it('should write JSON into a markdown file', async () => {
    await write(mockPath + '/foo.md')(MOCK_JSON)

    const actual = fs.readFileSync(path.join(mockPath, 'foo.md'), 'utf8')
    const expected = markdown

    expect(actual).toBe(expected)
  })

  it('should reject the promise if wrong shape of data was given', async () => {
    await expect(write(mockPath + '/foo.md')({})).rejects.toEqual(
      Error(ERROR_MESSAGE)
    )
  })

  describe('write.sync', () => {
    it('should write JSON into a markdown file', () => {
      write.sync(mockPath + '/foo.md')(MOCK_JSON)

      const actual = fs.readFileSync(path.join(mockPath, 'foo.md'), 'utf8')
      const expected = markdown

      expect(actual).toBe(expected)
    })

    it('should throw error if wrong shape of data was given', () => {
      expect(() => {
        write.sync(mockPath + '/foo.md')({})
      }).toThrow()

      expect(() => {
        write.sync(mockPath + '/foo.md')({ data: {} })
      }).toThrow()
    })
  })
})
