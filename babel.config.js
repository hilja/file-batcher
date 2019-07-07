module.exports = api => {
  // Not 100% sure why this is needed, but it is.
  api.cache(true)

  const presets = ['@babel/preset-env']

  return { presets }
}
