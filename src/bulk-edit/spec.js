const fs = require('fs')
const {
  path,
  path2,
  basePath,
  markdown,
  markdownJSON
} = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')
const bulkEdit = require('./')

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('bulkEdit:', () => {
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

  it('should have index in the callback', () => {
    bulkEdit(path + '/*', ({ index }) => {
      expect(typeof index).toBe('number')
    })
  })

  it('should contain the data from the iterated file', () => {
    bulkEdit(path + '/*', ({ goods, index }) => {
      if (index === 1) {
        expect(goods).toEqual(markdownJSON())
      } else expect(goods).toEqual(markdownJSON('bar.md'))
    })
  })

  it('should have the needed actions', () => {
    bulkEdit(path + '/*', ({ actions }) => {
      expect(typeof actions).toBe('object')
      expect(typeof actions.update).toBe('function')
      expect(typeof actions.save).toBe('function')
      expect(typeof actions.remove).toBe('function')
    })
  })

  it('should have the original array around', () => {
    bulkEdit(path + '/*', ({ index, originalArray }) => {
      expect(originalArray.length).toBe(2)
    })
  })

  it('should not include the parent directories when globbing greedily', () => {
    bulkEdit(basePath + '/**', ({ index, originalArray }) => {
      expect(originalArray.length).toBe(4)
    })
  })
})
