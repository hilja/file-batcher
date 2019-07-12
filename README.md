# Front matter bulk editor

This package gives you few tool to edit Frontmatter fueled Markdown files, the stuff that most static site generators use. It's basically convenience wrapper around and the (gray-matter)[https://www.npmjs.com/package/gray-matter] package.

## Features

- Is asynchronous.
- Can do bulk edits.
- Provides the immutability-helper to edit the data int he posts.
- The `remove` method moves posts to your trash.
- Exposes `read`, `write`, and `remove` methods to edit individual posts.

## Install

```
npm i front-matter-bulk-editor
```

## Usage

We've got thousands upon thousands of files like this:

```yaml
---
title: Foo
description: Very Foo
date: '2019-07-12 07:28'
categories:
  - images
  - trains
---
Hello!
```

Then we can edit them like so:

```javascript
import { bulkEdit } from '../index.js'
;(async () => {
  // Blog in the files you need
  await bulkEdit('test-stuff/test-content/**', ({ goods, actions }) => {
    // Grab the tools you need
    const { update, save } = actions
    // And the goods you're going to use
    const { author } = goods.data

    if (author) {
      // Update the author name with the provided immutability-helper. It gives
      // you a nice syntax for updating complex shapes. The update function is
      // prepopulated with the data (goods) from the post, so you don't have to.
      const newData = update({
        data: { author: { $set: 'Slartibartfast' } }
      })

      // Or just mutate the original object by hand ¯\_(ツ)_/¯
      goods.data.author = 'Slartibartfast'

      // At the end you can save your post with the new data
      save(newData)
    }
  })
})()
```
