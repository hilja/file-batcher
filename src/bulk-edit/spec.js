const fs = require('fs')
const nodePath = require('path')
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
        'bar-md': markdown,
        'bar.js': 'js file :)'
      },
      [path2]: {
        'foo.md': markdown,
        'bar.md': markdown
      }
    })
  })

  test('should bail with undefined if no glob pattern was given', () => {
    expect(bulkEdit()).toBeUndefined()
  })

  test('should throw if now callback was given', () => {
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
        // Nuke the buffer for now. Maybe have tests for it.
        delete goods.orig

        if (index === 0) {
          // They don't run in order.
          expect(goods).toEqual(markdownJSON(nodePath.basename(goods.path)))
        }

        done()
      }

      bulkEdit(path + '/*', onEach, undefined, 1)
    })

    test('should read other files than markdown if so specified', done => {
      const onEach = async ({ goods, index }) => {
        if (index === 0) {
          // There's only one, so we can rely on the order.
          expect(goods.path).toEqual(path + '/bar.js')
        }

        done()
      }

      const options = { fileExtension: '.js', limit: 1 }

      bulkEdit(path + '/*', onEach, undefined, options)
    })

    test('should have the needed actions', done => {
      const onEach = async ({ actions, index }) => {
        // Test only the first item, that's fine.
        if (index === 0) {
          expect(typeof actions).toBe('object')
          expect(typeof actions.update).toBe('function')
          expect(typeof actions.save).toBe('function')
          expect(typeof actions.remove).toBe('function')

          done()
        }
      }

      bulkEdit(path + '/*', onEach, undefined, 1)
    })
  })

  describe('afterAll callback:', () => {
    test('should be called', done => {
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
