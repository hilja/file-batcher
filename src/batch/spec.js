import fs from 'jest-plugin-fs'
const path = require('path')
const {
  path: mockPath,
  markdown,
  markdownJSON
} = require('../../fixtures/shapes')
const batch = require('./')

jest.mock('fs', () => require('jest-plugin-fs/mock'))

const markdownFiles = mockPath + '/*.md'
const nonMarkdownFiles = mockPath + '/*.js'

describe('batch', () => {
  beforeEach(() => {
    fs.mock({
      [mockPath]: {
        'foo.md': markdown,
        'bar.md': markdown,
        'baz.md': markdown,
        'foo.js': 'Foo',
        'bar.js': 'Bar',
        'baz.js': 'Baz'
      }
    })
  })

  test('should return undefined if no params', async () => {
    const actual = await batch()

    expect(actual).toBe(undefined)
  })

  test('should parse return the contents of the MD files if no callback provided', async () => {
    const actual = await batch(markdownFiles)

    const expected = [
      markdownJSON('foo.md'),
      markdownJSON('bar.md'),
      markdownJSON('baz.md')
    ]

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('should return the contents of the non-MD files if no callback provided', async () => {
    const actual = await batch(nonMarkdownFiles)

    const expected = ['Foo', 'Bar', 'Baz']

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('should be possible to massage the contents of the files in the callback', async () => {
    const actual = await batch(markdownFiles, 1, ({ goods, index }) => {
      return goods.data.title + index
    })

    const expected = ['foo0', 'foo1', 'foo2']

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('should be possible to do async operations in the callback', async () => {
    const actual = await batch(markdownFiles, 1, async ({ goods, index }) => {
      // Something async here, fetch or whatever...
      const fakeFetch = new Promise(resolve => {
        setTimeout(() => resolve('something-from-an-api'), 100)
      })

      // Wait for it.
      const dataFromAPI = await fakeFetch

      return dataFromAPI + index
    })

    const expected = [
      'something-from-an-api0',
      'something-from-an-api1',
      'something-from-an-api2'
    ]

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('should contain the data from the files if array of paths was given', done => {
    const arrayInput = [
      path.join(mockPath, 'foo.md'),
      path.join(mockPath, 'bar.md')
    ]

    batch(arrayInput, 1, async ({ goods, index }) => {
      if (index === 0) {
        expect(goods).toEqual(markdownJSON(path.basename(goods.path)))
      }

      if (index === 1) {
        expect(goods).toEqual(markdownJSON(path.basename(goods.path)))
      }

      done()
    })
  })

  test('should have the needed actions and helpers in the callback', done => {
    batch(markdownFiles, 1, async ({ actions, index, delay }) => {
      // Test only the first item, that’s fine.
      if (index === 0) {
        expect(typeof actions).toBe('object')
        expect(typeof actions.update).toBe('function')
        expect(typeof actions.save).toBe('function')
        expect(typeof actions.remove).toBe('function')
        expect(typeof actions.rename).toBe('function')
        expect(typeof actions.pMap).toBe('function')
        expect(typeof delay).toBe('function')

        done()
      }
    })
  })

  test('should have the original shape in the callback', done => {
    batch(markdownFiles, 1, async ({ index, files }) => {
      if (index === 0) {
        const expected = [
          path.join(mockPath, 'bar.md'),
          path.join(mockPath, 'baz.md'),
          path.join(mockPath, 'foo.md')
        ]
        expect(files).toEqual(expect.arrayContaining(expected))

        done()
      }
    })
  })

  test.todo('Test all the actions inside the callback.')
})
