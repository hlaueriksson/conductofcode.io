---
layout: post
title: Social meta tags with Jekyll
date: 2016-03-30 21:00:00
update: 2016-03-30 23:00:00
tags: Jekyll, Blogging
image:
 path: meta.png
 width: 1200
 height: 630
---

This is how I added social meta tags to this Jekyll blog to optimize sharing on **Facebook**, **Twitter** and **Google+**.

You can browse the repo at [https://github.com/hlaueriksson/conductofcode.io](https://github.com/hlaueriksson/conductofcode.io)

The tags should differ somewhat for pages and posts on the blog. To be able to distinguish between *posts vs pages* I updated `_config.yml` with:

{% gist hlaueriksson/4384d76d06aa7bcd1be0f6de1aa88593 %}

{% raw %}
Then I can check for posts with `{% if page.is_post %}`
{% endraw %}

Sharing on social media improves with *images*. I added support for specifying an image in the front matter for a page/post:

{% gist hlaueriksson/5c1c4a9aaf9957a129cf0f972b7e1c43 %}

I place the images for a page/post in a folder that correspond with the *permalink*, i.e. `\post\social-meta-tags-with-jekyll\meta.png`

## Facebook

Facebook uses the [Open Graph protocol](http://ogp.me/) and it looks like this:

{% gist hlaueriksson/b14fabb773c4e083a17a17977e066113 %}

The Jekyll include file to generate that:

{% gist hlaueriksson/31461a63225fc8b8826e579e7051ee7b %}

It will end up like this:

![Share on Facebook](facebook.png)

Test your markup with:

- [Facebook Debugger](https://developers.facebook.com/tools/debug/)

## Twitter

Twitter uses [Twitter Cards](https://dev.twitter.com/cards/overview) and it looks like this:

{% gist hlaueriksson/f78be2c1116dda5ffb192e5df775df8e %}

The Jekyll include file to generate that:

{% gist hlaueriksson/7b1bd5c4878eb215afa7ec82dd11a030 %}

It will end up like this:

![Share on Twitter](twitter.png)

Test your markup with:

- [Twitter Card Validator](https://cards-dev.twitter.com/validator/)

## Google+

Google+ uses [structured data](http://schema.org/) and it can look like this:

{% gist hlaueriksson/3658242672cddea63692be976c6b6a42 %}

I prefer to use **JSON-LD** over RDFa and Microdata, because it does not force you change any existing markup.

The Jekyll include file to generate that:

{% gist hlaueriksson/92ffb886c90708fe4129ba36a73df62c %}

It will end up like this:

![Share on Google+](google.png)

Test your markup with:

- [Google Structured Data Testing Tool](https://developers.google.com/structured-data/testing-tool/)

<!-- The color of social is http://bada55.io/50c1a1 -->
