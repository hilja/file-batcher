const { batch } = require('..')

batch('fixtures/test-content/**', 1, async ({ goods, delay }) => {
  // Slow down the iteration on purpose. Maybe you need to call an API that
  // heavily limits the requests per minute.
  await delay(1000)

  // Make your call or whatever.
  // const data = await fetch(https://example.com/api-with-strict-rpm)

  console.log('This should fire every second:', goods.path)
})
