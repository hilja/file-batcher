import { writeSync, read } from '../index.js'
;(async () => {
  const files = await read([
    './test-stuff/test-content/articles/abandoned-euro-star-train.md',
    './test-stuff/test-content/drafts/albino-raven.md'
  ])

  files.map(file => {
    const { date } = file.data
    // Edit the date, for example
    file.data.date = date && date + ' foobar'

    // Change the date back to what it was
    // file.data.date = date && date.replace(' foobar', '')

    console.log(file)

    writeSync(file.path, file)
  })
})()
