const write = require('./')
const path = require('path')
const fs = require('fs')
const { path: mockPath, markdown } = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())

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

describe('writeSync:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({ [mockPath]: {} })
  })

  it('should write JSON into a markdown file synchronously', () => {
    write.sync(mockPath + '/foo.md')(MOCK_JSON)

    const actual = fs.readFileSync(path.join(mockPath, 'foo.md'), 'utf8')
    const expected = markdown

    expect(actual).toBe(expected)
  })

  it('should write JSON into a markdown file asynchronously', async () => {
    await write(mockPath + '/foo.md')(MOCK_JSON)

    const actual = fs.readFileSync(path.join(mockPath, 'foo.md'), 'utf8')
    const expected = markdown

    expect(actual).toBe(expected)
  })
})
