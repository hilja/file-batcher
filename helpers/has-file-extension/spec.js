const hasFileExtension = require('.')

describe('hasFileExtension:', () => {
  test('should return true if string has right file extension', () => {
    expect(hasFileExtension('foo.md', '.md')).toBeTruthy()
    expect(hasFileExtension('foo.MD', '.md')).toBeTruthy()
  })

  test('should return false if the given extension was not matched', () => {
    expect(hasFileExtension('foo.md', '.js')).toBeFalsy()
  })

  test('should take semi-regex', () => {
    expect(hasFileExtension('foo.md', '.md|.markdown')).toBeTruthy()
    expect(hasFileExtension('foo.markdown', '.md|.markdown')).toBeTruthy()
  })

  test('should not match anything if empty string was given', () => {
    expect(hasFileExtension('foo.md', '')).toBeTruthy()
    expect(hasFileExtension('....swag....', '')).toBeTruthy()
  })
})
