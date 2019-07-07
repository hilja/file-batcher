import fs from 'fs'
import readFile from './index.mjs'
import { path, markdown, markdownJSON } from '../../test-stuff/test-fixtures'
import createFiles from '../../test-stuff/create-files'

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('readFile', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      [path]: {
        'foo.md': markdown
      }
    })
  })

  it('should read a file and parse its contents into JSON', () => {
    const actual = readFile('test-stuff/test-content/articles/foo.md')
    const expected = markdownJSON()

    expect(actual).toEqual(expected)
  })
})
