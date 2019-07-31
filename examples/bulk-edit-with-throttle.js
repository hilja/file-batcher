const { bulkEdit } = require('..')

const onEach = async ({ goods, throttle }) => {
  // Slow down the iteration on purpose. Maybe you need to call an API that
  // heavily limits the requests per minute. Note: you need to `await` it.
  await throttle(1000)

  // Make you call or whatever.
  // const data = await fetch(https://example.com/api-with-strict-rpm)

  console.log('This should fire every second:', goods.path)
}

bulkEdit('fixtures/test-content/**', onEach, undefined, 1)
