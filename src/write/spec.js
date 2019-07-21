const write = require('./')
const path = require('path')
const fs = require('fs')
const { path: mockPath, markdown } = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())

const FRONT_MATTER_OBJECT = {
  content: 'Hello\n',
  data: {
    title: 'foo',
    description: 'bar',
    categories: ['images', 'birds']
  }
}

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)
const filePath = path.join(mockPath, 'foo.md')

describe('write:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({ [mockPath]: {} })
  })

  test('should write JSON into a markdown file', async () => {
    await write(filePath, FRONT_MATTER_OBJECT)

    const actual = fs.readFileSync(filePath, 'utf8')
    const expected = markdown

    expect(actual).toBe(expected)
  })

  test('should write non Front Matter data into file as is', async () => {
    await write(filePath, 'foo')
    const actual = fs.readFileSync(filePath, 'utf8')
    const expected = 'foo'

    expect(actual).toBe(expected)
  })

  describe('write.sync:', () => {
    test('should parse an object into Front Matter and write it to a file', () => {
      write.sync(filePath, FRONT_MATTER_OBJECT)

      const actual = fs.readFileSync(filePath, 'utf8')
      const expected = markdown

      expect(actual).toBe(expected)
    })

    test('should write non Front Matter data into file as is', () => {
      write.sync(filePath, 'foo')
      const actual = fs.readFileSync(filePath, 'utf8')
      const expected = 'foo'

      expect(actual).toBe(expected)
    })
  })
})
