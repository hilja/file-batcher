const patterns = '[/\\\\]node_modules[/\\\\](?!aggregate-error|clean-stack|is-path-inside|trash|escape-string-regexp|indent-string|p-map).+\\.(js|jsx)$';

module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'mjs'],
  transform: {
    '^.+.m?js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    patterns,
  ],
  setupFiles: ['<rootDir>/fixtures/jest.init.js']
}
