const fs = require('fs')
const path = require('path')
const {
  path: mockPath,
  path2: mockPath2,
  markdown,
  markdownJSON
} = require('../../fixtures/shapes')
const createFiles = require('../../fixtures/create-files')
const bulkEdit = require('./')

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`.
const mockFiles = createFiles(fs)

describe('bulkEdit:', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      [mockPath]: {
        'foo.md': markdown,
        'bar.md': markdown,
        'baz.txt': 'foo',
        '.dotfile': 'bar',
        'bar-md': markdown,
        'bar.js': 'js file :)'
      },
      [mockPath2]: {
        'foo.md': markdown,
        'bar.md': markdown
      }
    })
  })

  test('should bail with undefined if no glob pattern was given', () => {
    expect(bulkEdit()).toBeUndefined()
  })

  test('should throw if no `onEach` callback was given', () => {
    expect(() => {
      bulkEdit('foo/path/*')
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

      bulkEdit(mockPath + '/*', onEach, undefined, 1)
    })

    test('should contain the data from the iterated file', done => {
      const onEach = async ({ goods, index }) => {
        // Nuke the buffer for now. Maybe have tests for it.
        delete goods.orig

        // Have to check the index here because they're not run in order,
        // because it's async even tho the limit is 1.
        if (index === 0) {
          expect(goods).toEqual(markdownJSON(path.basename(goods.path)))
        }

        done()
      }

      bulkEdit(mockPath + '/*', onEach, undefined, 1)
    })

    test('should contain the data from the iterated file if array of paths was given', done => {
      const arrayInput = [
        path.join(mockPath, 'foo.md'),
        path.join(mockPath, 'bar.md')
      ]

      const onEach = async ({ goods, index }) => {
        // Nuke the buffer for now. Maybe have tests for it.
        delete goods.orig

        if (index === 0) {
          expect(goods).toEqual(markdownJSON(path.basename(goods.path)))
        }

        if (index === 1) {
          expect(goods).toEqual(markdownJSON(path.basename(goods.path)))
        }

        done()
      }

      bulkEdit(arrayInput, onEach, undefined, 1)
    })

    test('should read other files than markdown if so specified', done => {
      const onEach = async ({ goods }) => {
        // There's only one, so we can rely on the order.
        expect(goods).toEqual('js file :)')

        done()
      }

      bulkEdit(mockPath + '/*.js', onEach, undefined, 1)
    })

    test.todo('Test all the actions inside the callback.')

    test('should have the needed actions', done => {
      const onEach = async ({ actions, index }) => {
        // Test only the first item, that's fine.
        if (index === 0) {
          expect(typeof actions).toBe('object')
          expect(typeof actions.update).toBe('function')
          expect(typeof actions.save).toBe('function')
          expect(typeof actions.remove).toBe('function')
          expect(typeof actions.rename).toBe('function')

          done()
        }
      }

      bulkEdit(mockPath + '/*', onEach, undefined, 1)
    })
  })

  describe('afterAll callback:', () => {
    test('should be called', done => {
      var foo = false

      const onEach = () => {}

      const afterAll = () => {
        // Uh, I just want to know if this was called, it doesn't return
        // anything to test with, so I'll just set this to true to have an ide
        // if this piece of code was ever reached.
        foo = true
        expect(foo).toBeTruthy()
        done()
      }

      bulkEdit(mockPath + '/*', onEach, afterAll, 1)
    })
  })
})
