module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'mjs'],
  transform: {
    '^.+.m?js$': 'babel-jest'
  },
  setupFiles: ['<rootDir>/test-stuff/jest.init.js']
}
