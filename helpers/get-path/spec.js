import getPath from './index.mjs'

describe('getPath', () => {
  it('should return empty string is empty string was given', () => {
    const actual = getPath('')
    const expected = ''

    expect(actual).toBe(expected)
  })

  it('should return an absolute path when absolute path is given', () => {
    const actual = getPath('/bar/foo.md')
    const expected = '/bar/foo.md'

    expect(actual).toBe(expected)
  })

  it('should return absolute path when a relative path was given', () => {
    const actual = getPath('./foo.md')
    const expected = process.env.PWD + '/foo.md'

    expect(actual).toBe(expected)
  })
})
