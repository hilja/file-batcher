let bulkEdit = require('.')

jest.mock('.')

describe('bulkEdit:', () => {
  test('should be called with an input', () => {
    bulkEdit(['foo.md', 'bar.md'])

    expect(bulkEdit).toHaveBeenCalledWith(['foo.md', 'bar.md'])
  })
})
