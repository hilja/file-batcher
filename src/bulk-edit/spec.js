const fs = require('fs')
const { path, path2, markdown, markdownJSON } = require('../../fixtures/shapes')
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

  it('should bail with undefined if no glob pattern was given', () => {
    expect(bulkEdit()).toBeUndefined()
  })

  it('should throw if now callback was given', () => {
    expect(() => {
      bulkEdit(path + '/*')
    }).toThrow()
  })

  describe('callback', () => {
    it('should have index arg', async done => {
      const afterEach = async ({ index }) => {
        await expect(typeof index).toBe('number')

        done()
      }

      bulkEdit(path + '/*', afterEach)
    })

    it('should contain the data from the iterated file', done => {
      const afterEach = async ({ goods, index }) => {
        // Nuke the buffer
        delete goods.orig

        if (index === 1) {
          await expect(goods).toEqual(markdownJSON())
        } else expect(goods).toEqual(markdownJSON('bar.md'))

        done()
      }

      bulkEdit(path + '/*', afterEach)
    })

    it('should have the needed actions', done => {
      const afterEach = async ({ actions }) => {
        expect(typeof actions).toBe('object')
        expect(typeof actions.update).toBe('function')
        expect(typeof actions.save).toBe('function')
        expect(typeof actions.remove).toBe('function')

        done()
      }

      bulkEdit(path + '/*', afterEach)
    })
  })
})
