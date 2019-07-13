# Front matter bulk editor

This package gives you few tool to edit Frontmatter fueled Markdown files, the stuff that most static site generators use. It's basically convenience wrapper around and the [gray-matter](https://www.npmjs.com/package/gray-matter) package.

## Features

- Is asynchronous.
- Uses glob.
- Can do bulk edits without you writing any code.
- Provides a sane API ([`immutability-helper`](https://github.com/kolodny/immutability-helper#update)) to edit the data in the posts.
- The `remove` method doesn't delete the files, but chugs them into the trash.
- Exposes `read`, `write`, and `remove` methods to edit individual posts.
- Is probably fast.
- Is generally a really good package.

## Install

```
npm i front-matter-bulk-editor
```

## Usage

Imagine that we've got thousands upon thousands of files like this:

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

We can edit them like so:

```js
import { bulkEdit } from '../index.js'
;(async () => {
  await bulkEdit('fixtures/test-content/**', ({ goods, actions }) => {
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

## API

You've got 4 public methods at your disposal.

### bulkEdit(pattern, callback)

Doesn't return anything, you just do stuff inside the callback.

#### pattern

Type: `string`

Uses [glob](https://www.npmjs.com/package/glob).

#### callback(args)

##### args

Type: `object`

##### args.goods

Type: `object`

The JSON from the iterated file, provided by [gray-matter](https://www.npmjs.com/package/gray-matter).

It has the following shape:

```
{
  content: 'Hello\n',
  data: {
    title: 'foo',
    description: 'bar',
    categories: ['images']
  },
  isEmpty: false,
  excerpt: '',
  path: '/path/to/the/articles/bar.md'
}
```

##### args.actions

Type: `object`

Actions has all the tools you need to edit the files.

###### args.actions.update

Type: `function`

This is a prepopulated [`immutability-helper`](https://github.com/kolodny/immutability-helper#update).

You can use it inside the callback like so:

```js
const newData = update({
  data: { author: { $set: 'Slartibartfast' } }
})
```

See more [advanced examples in the `immutability-helper` docs](https://github.com/kolodny/immutability-helper#update).

###### args.actions.index

Type: `number`

The index of the current iteration.

###### args.actions.originalArray

Type: `array`

The full, original array the iteration is part of, it's basically the [third parameter of the `Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

### read(pattern)

Read in a file and parses the Frontmatter in it.

Returns a `Promise<object[]>` of the markdown files given.

#### pattern

Type: `string`

Uses [glob](https://www.npmjs.com/package/glob).

### remove(path, options)

Moves a given file into your computers trash, where you can then recover it, if you so like.

#### path

Type: `string`

#### options

Type: `object`

Options to pass to the underlying library [`trash`](https://www.npmjs.com/package/trash).

### write(file)(data, options)

An asynchronous, curried function that takes an object, stringifies it into frontmatter format with gray-matter's `stringify` method. The function is curried so you can prepopulate it if needed.

#### file

Type: `string`

A file path.

#### data

Type: `object`

An object of data to write into a file, in a following format:

```
{
  data: {
    title: 'foo',
    description: 'bar'
  }
  content: 'Hello'
}
```

#### options

Type: `object`

Options passed to the [`gray-matter`'s `stringify` method](https://www.npmjs.com/package/gray-matter#stringify).

### writeSync(file)(data, options)

Same as `write` but asynchronous.
