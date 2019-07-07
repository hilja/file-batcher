const isDate = require('.')

describe('isDate', () => {
  it('should return false if null given', () => {
    expect(isDate(null)).toBe(false)
  })

  it('should return true if valid date given', () => {
    expect(isDate('2018-12-07')).toBe(true)
  })

  it('should return false if invalid date given', () => {
    expect(isDate('2018.12-07')).toBe(false)
    expect(isDate('078-12-2018')).toBe(false)
  })

  it('should return true if valid date given', () => {
    expect(isDate('2018-12-07 07:28:28')).toBe(true)
  })
})
