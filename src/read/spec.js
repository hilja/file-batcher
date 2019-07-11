import fs from 'fs'
import read from './index.mjs'
import {
  path,
  path2,
  markdown,
  markdownJSON
} from '../../test-stuff/test-fixtures'
import createFiles from '../../test-stuff/create-files'

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('read:', () => {
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

  it('should read a folder file', async () => {
    const actual = await read(path + '/*')
    const expected = [markdownJSON('bar.md'), markdownJSON()]

    expect(actual).toEqual(expected)
  })

  it('should read a single file', async () => {
    const actual = await read(path + '/foo.md')
    const expected = [markdownJSON()]

    expect(actual).toEqual(expected)
  })
})
