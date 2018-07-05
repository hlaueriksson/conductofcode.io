---
layout: post
title: Social meta tags with Jekyll
date: 2016-03-30 21:00:00
last_modified_at: 2016-03-30 23:00:00
tags:
 - Jekyll
 - Blogging
image:
 path: meta.png
 width: 1200
 height: 630
---

This is how I added social meta tags to this Jekyll blog to optimize sharing on **Facebook**, **Twitter** and **Google+**.

You can browse the repo at [https://github.com/hlaueriksson/conductofcode.io](https://github.com/hlaueriksson/conductofcode.io)

The tags should differ somewhat for pages and posts on the blog. To be able to distinguish between *posts vs pages* I updated `_config.yml` with:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 _config.yml %}

{% raw %}
Then I can check for posts with `{% if page.is_post %}`
{% endraw %}

Sharing on social media improves with *images*. I added support for specifying an image in the front matter for a page/post:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 front-matter.txt %}

I place the images for a page/post in a folder that correspond with the *permalink*, i.e. `\post\social-meta-tags-with-jekyll\meta.png`

## Facebook

Facebook uses the [Open Graph protocol](http://ogp.me/) and it looks like this:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 facebook.html %}

The Jekyll include file to generate that:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 includes-og.html %}

It will end up like this:

![Share on Facebook](facebook.png)

Test your markup with:

- [Facebook Debugger](https://developers.facebook.com/tools/debug/)

## Twitter

Twitter uses [Twitter Cards](https://dev.twitter.com/cards/overview) and it looks like this:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 twitter.html %}

The Jekyll include file to generate that:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 includes-twitter.html %}

It will end up like this:

![Share on Twitter](twitter.png)

Test your markup with:

- [Twitter Card Validator](https://cards-dev.twitter.com/validator/)

## Google+

Google+ uses [structured data](http://schema.org/) and it can look like this:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 google.html %}

I prefer to use **JSON-LD** over RDFa and Microdata, because it does not force you change any existing markup.

The Jekyll include file to generate that:

{% gist hlaueriksson/8139a924cdfaa95a6384df99201dfd89 includes-json-ld.html %}

It will end up like this:

![Share on Google+](google.png)

Test your markup with:

- [Google Structured Data Testing Tool](https://developers.google.com/structured-data/testing-tool/)

<!-- The color of social is http://bada55.io/50c1a1 -->
