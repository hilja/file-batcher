# File Batcher

A slightly opinionated tool to batch process large quantities of files asynchronously. It provides you some convenient tools to edit Front Matter fueled Markdown files (the stuff that most static site generators use). But it's not limited to any given filetype or format.

It could be used for, for example, right at the top my head, to:

- Search and replace in multiple files.
- To rename large quantities of files.
- Find unused packages by scanning source files.
- Reformatting chunks of text.
- Analyzing the readability of text in blog posts.
- Whatever you want, world is your oyster...

## Features

- Is asynchronous.
- Can glob.
- Can do bulk edits without you writing any iterators.
- Provides a sane API to edit complex shapes of data with ([`immutability-helper`](https://github.com/kolodny/immutability-helper#update))
- The `remove` method doesn't delete the files, but chugs them into the trash.
- Exposes `read`, `write`, and `remove` methods to edit individual posts.
- Is probably fast.
- Is generally a really good package.

## Install

```
npm i file-batcher
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
import { bulkEdit } from 'file-batcher'

// The iterator function
const onEach = async ({ goods, actions }) => {
  const { author } = goods.data
  const { update, save } = actions

  if (!author) return

  // Update the author name with the provided immutability-helper, it gives
  // you a nice syntax for updating complex shapes. The update function is
  // prepopulated with the data (goods) from the post, so you don't have to.
  const newData = update({
    data: { author: { $set: 'Slartibartfast' } }
  })

  // At the end you can save your post with the new data
  await save(newData)

  console.log('Just saved:', goods.path)
}

// This runs at the end
const afterAll = () => console.log('All done!')

// You can limit how much the async functions churns with the last param
bulkEdit('fixtures/test-content/**', onEach, afterAll, 5)
```

See [examples](./examples) for more examples.

## API

You've got 4 public methods at your disposal.

### bulkEdit(globPattern, onEach[, afterAll, options])

Doesn't return anything, you just do stuff inside the async `onEach` callback.

#### globPattern

Type: `string`

Uses [glob](https://www.npmjs.com/package/glob).

#### onEach(args)

The function is run on every iteration. It gives you set of handy tools in the args. See below.

**args**

Type: `object`

**args.goods**

Type: `object|any`

If the target file is Gray Matter, then `goods` will be an object provided by [gray-matter](https://www.npmjs.com/package/gray-matter), with a following shape:

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

If the file is not Front Matter file, then `goods` will be the file contents verbatim.

**args.actions**

Type: `object`

Actions has all the tools you need to edit/save the files.

#### args.actions.update(pattern)\*\*

Type: `function`

This is a prepopulated [`immutability-helper`](https://github.com/kolodny/immutability-helper#update). It's just a tool that provides a syntax for editing complex shapes. Using it is completely optional.

The syntax is like so:

```js
const newData = update({
  data: { author: { $set: 'Slartibartfast' } }
})
```

See more [advanced examples in the `immutability-helper` docs](https://github.com/kolodny/immutability-helper#update).

**args.actions.index**

Type: `number`

###### args.actions.save(data[, path])

Type: `function`

Saves the currently iterated file, with the modified data, or whatever is passed to it. See the [`write`](#writepath-data-options) method for more info.

**data**

Type: `object`

The data to save, in the [upper-mentioned shape](#argsgoods).

Example:

```js
const capitalize = string => string[0].toUpperCase() + string.substring(1)

goods.data.name = capitalize(goods.data.name)

await save(goods)
```

**path**

Type: `string`

This helper function is prepopulated with with the current file, so, if you're operating on that file, you don't need to pass in a path. You can, tho, if you want to save it to a new location.

###### args.actions.remove(path?)

Type: `function` Returns: `Promise`

This one doesn't actually delete anything, but moves it to your computers Trash.

**path**

Type: `string`

It's prepopulated with the current file, so use this param only if you want to delete another file, that isn't the one in the iteration.

#### args.files

Type: `array`

The original array of files we're looping over.

### read(file)

Returns: `Promise<object>`

Reads in a file asynchronously and returns it's contents. If it's a markdown file, it parses the Frontmatter in it and returns us the the familiar shape:

```
{
  content: '',
  data: {
    description: 'You literally took a shit in the blender',
    title: 'Kitchen nightmares'
  },
  isEmpty: false,
  excerpt: '',
  path: '/path/to/kitchen-nightmares.md'
}
```

#### file

Type: `string`

A path to a file. Relative to the current working directory.

### read.sync(file)

Returns: `object`

Same the [async read method](readfile) but sync. Expect that there is `orig` which contains the file as a buffer. The async read method doesn't have that.

### remove(path[, options])

Returns: `Promise`

Moves a given file into your computers trash, where you can then recover it, if you so like.

#### path

Type: `string`

A path to a file. Relative to the current working directory.

#### options?

Type: `object`

Options to pass to the underlying library [`trash`](https://www.npmjs.com/package/trash).

### write(path, data[, options])

An asynchronous function that takes some data and writes it into a file. If the data looks like it's meant to be parsed into a Front Matter, then it will be parsed into Front Matter. E.g. it has a shape: `{ content: '', data: {} }`.

#### path

Type: `string`

Where to write the data. Relative to the current working directory.

#### data

Type: `object|any`

If it's an object that has `data` and `content` in it, then it's parsed into Front Matter. Otherwise it's just written into the file as is.

#### options.writeFile

Type: `object`

Options to pass to Node's [`fs.readFile`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback).

#### options.stringify

Options to pass to [`gray-matter`'s `stringify` method](https://www.npmjs.com/package/gray-matter#stringify).

### write.sync(path, data[, options])

Same as `write` but synchronous.
