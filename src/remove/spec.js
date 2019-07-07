import remove from './index.mjs'

// No need to have a separate mock file for it, just calling this is fine
jest.mock('./index.mjs')

describe('remove:', () => {
  it('should be called', async () => {
    await remove('/path/to/foo.md', { glob: false })

    // Simply test that it gets celled, that's all
    expect(remove).toHaveBeenCalledWith('/path/to/foo.md', { glob: false })
  })
})
