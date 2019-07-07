export const path = `${process.env.PWD}/test-stuff/test-content/articles`
export const path2 = `${process.env.PWD}/test-stuff/test-content/drafts`

export const markdown = `---
title: foo
description: bar
categories:
  - images
  - birds
---
Hello
`

export const markdownJSON = (fileName = 'foo.md', dir = path) => ({
  content: 'Hello\n',
  data: {
    title: 'foo',
    description: 'bar',
    categories: ['images', 'birds']
  },
  excerpt: '',
  isEmpty: false,
  path: dir + '/' + fileName
})
