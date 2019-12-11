import fs from 'jest-plugin-fs'
const read = require('.')
const { path, markdown, markdownJSON } = require('../../fixtures/shapes')

jest.mock('fs', () => require('jest-plugin-fs/mock'))

describe('read:', () => {
  beforeEach(() => {
    fs.mock({
      [path]: {
        'foo.md': markdown,
        'bar.md': 'foo'
      }
    })
  })
  afterEach(() => fs.restore())

  test('should read a file and parse its contents into an object', async () => {
    const actual = await read(path + '/foo.md')
    const expected = markdownJSON()

    expect(actual).toEqual(expected)
  })

  test('should read a non Front Matter file', async () => {
    const actual = await read(path + '/bar.md')
    const expected = 'foo'

    expect(actual).toEqual(expected)
  })
})
