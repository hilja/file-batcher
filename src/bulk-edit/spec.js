import bulkEdit from './index.mjs'

jest.mock('fs', () => new (require('metro-memory-fs'))())
jest.mock('./index.mjs')

describe('bulkEdit:', () => {
  it('should be called wih all the options', async () => {
    bulkEdit('path/to/foo')

    // Simply test that it gets celled, that's all
    expect(bulkEdit).toHaveBeenCalledWith('path/to/foo')
  })
})
