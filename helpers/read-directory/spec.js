import fs from 'fs'
import readDirectory from './index.mjs'
import { path, markdown, markdownJSON } from '../../test-stuff/test-fixtures'
import createFiles from '../../test-stuff/create-files'

jest.mock('fs', () => new (require('metro-memory-fs'))())

// Populate the `createFiles` with the mocked `fs`
const mockFiles = createFiles(fs)

describe('readDirectory', () => {
  beforeEach(() => {
    fs.reset()
    mockFiles({
      [path]: {
        'foo.md': markdown,
        'bar.md': markdown
      }
    })
  })

  it('should read all files from a directory', async () => {
    const actual = await readDirectory(path)
    const expected = [markdownJSON(), markdownJSON('bar.md')]

    expect(actual).toEqual(expected)
  })
})
