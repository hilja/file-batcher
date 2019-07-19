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
        'bar.md': markdown,
        'baz.txt': 'foo',
        '.dotfile': 'bar',
        'bar-md': markdown
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

  describe('onEach callback:', () => {
    test('should have index arg', done => {
      const onEach = async ({ index }) => {
        if (index === 1) {
          expect(typeof index).toBe('number')
        }

        done()
      }

      bulkEdit(path + '/*', onEach, undefined, 1)
    })

    test('should contain the data from the iterated file', done => {
      const onEach = async ({ goods, index }) => {
        // Nuke the buffer
        delete goods.orig

        if (index === 1) {
          expect(goods).toEqual(markdownJSON())
        } else {
          expect(goods).toEqual(markdownJSON('bar.md'))
        }

        done()
      }

      bulkEdit(path + '/*', onEach, undefined, 1)
    })

    test('should read other files than markdown if so specified', done => {
      const onEach = async ({ goods, index }) => {
        if (index === 5) {
          expect(goods.path).toEqual(path + '/bar-md')
        }

        done()
      }

      const options = { onlyMdFiles: false, limit: 1 }

      bulkEdit(path + '/*', onEach, undefined, options)
    })

    test('should have the needed actions', done => {
      const onEach = async ({ actions }) => {
        expect(typeof actions).toBe('object')
        expect(typeof actions.update).toBe('function')
        expect(typeof actions.save).toBe('function')
        expect(typeof actions.remove).toBe('function')

        done()
      }

      bulkEdit(path + '/*', onEach, undefined, 1)
    })
  })

  describe('afterAll callback:', () => {
    test.only('should be called', done => {
      var foo = false
      const onEach = () => {}
      const afterAll = () => {
        // Uh, I just want to know if thi was called, it doesn't return anything
        // to test with.
        foo = true
        expect(foo).toBeTruthy()
        done()
      }

      bulkEdit(path + '/*', onEach, afterAll, 1)
    })
  })
})
