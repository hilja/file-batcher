const fs = require('fs')
const isMarkdownFile = require('./')
const createFiles = require('../../fixtures/create-files')

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('isMarkdownFile:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      bar: {
        '/foo.MD': 'foo',
        '/foo.md': 'foo',
        '/foo.markdown': 'foo',
        '/foo.MARKDOWN': 'foo',
        '/.foo.md': 'hidden file'
      },
      '/baz.md': {},
      '/.foo.md': 'hidden file'
    })
  })

  it('should return true if `.md` or `.MD` file was given', () => {
    expect(isMarkdownFile('/bar/foo.md')).toBeTruthy()
    expect(isMarkdownFile('/bar/foo.MD')).toBeTruthy()
  })

  it('should return true if `.markdown` file was given', () => {
    expect(isMarkdownFile('/bar/foo.markdown')).toBeTruthy()
    expect(isMarkdownFile('/bar/foo.MARKDOWN')).toBeTruthy()
  })

  it('should return false if directory was given', () => {
    expect(isMarkdownFile('/baz.md')).toBeFalsy()
  })

  it('should return false if hidden file was given', () => {
    expect(isMarkdownFile('/.foo.md')).toBeFalsy()
  })

  it('should return false if hidden file in a path was given', () => {
    expect(isMarkdownFile('/bar/.foo.md')).toBeFalsy()
  })
})
