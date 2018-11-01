---
layout: post
title: Introducing Jekyll URL Shortener
description: Building a URL Shortener with Jekyll and GitHub Pages
date: 2018-11-01 06:00:00
tags:
 - Jekyll
 - GitHub Pages
image:
 path: /post/introducing-jekyll-url-shortener/logo.png
 width: 640
 height: 400
---

I felt the need to create my own URL Shortener. I ended up with a template repository for making URL Shorteners with Jekyll and GitHub Pages.

The source code and documentation can be found here:

* [https://github.com/hlaueriksson/jekyll-url-shortener](https://github.com/hlaueriksson/jekyll-url-shortener)

## What?

> [URL shortening](https://en.wikipedia.org/wiki/URL_shortening) is a technique on the World Wide Web in which a Uniform Resource Locator (URL) may be made substantially shorter and still direct to the required page.

The [Jekyll URL Shortener](https://github.com/hlaueriksson/jekyll-url-shortener) repository is a template for creating your very own URL Shortener:

> ✂️🔗 This is a template repository for making URL Shorteners with Jekyll and GitHub Pages. Create short URLs that can be easily shared, tweeted, or emailed to friends. Fork this repo to get started.

## How?

To create your own URL Shortener, do this:

1. Buy and configure a (short) domain name
2. Fork or clone the [Jekyll URL Shortener](https://github.com/hlaueriksson/jekyll-url-shortener) repository
3. Configure the repository and code to your liking
4. Create short links with Jekyll pages

Here follows a description of how I created my own URL Shortener...

### 1. Domain Name

I bought the domain name [`hlaueriksson.me`](https://hlaueriksson.me) from a Swedish _domain name registrar_.
I will use this as an _apex domain_, so I configured `A` records with my DNS provider:

![DNS](dns.png)

### 2. Fork / Clone

I cloned the [Jekyll URL Shortener](https://github.com/hlaueriksson/jekyll-url-shortener) repository to [https://github.com/hlaueriksson/hlaueriksson.me](https://github.com/hlaueriksson/hlaueriksson.me)

### 3. Configure

The `_config.yml` file, located in the root of the repository, contains configuration for Jekyll.

I modified this file to fit my needs:

{% gist hlaueriksson/0c605458ec7f2a107773484a697f3023 _config.yml %}

The `Settings` / `GitHub Pages` of the repository provides configuration for hosting the Jekyll site.

I modified these settings to fit my needs:

![GitHub Pages](github-pages.png)

### 4. Short Links

Short links are created with as Jekyll pages in the root of the repository:

{% gist hlaueriksson/0c605458ec7f2a107773484a697f3023 repo.md_ %}

* Redirects from [https://hlaueriksson.me/repo/](https://hlaueriksson.me/repo/) to [https://github.com/hlaueriksson/hlaueriksson.me](https://github.com/hlaueriksson/hlaueriksson.me)

{% gist hlaueriksson/0c605458ec7f2a107773484a697f3023 jekyll-url-shortener.md_ %}

* Redirects from [https://hlaueriksson.me/✂️🔗/](https://hlaueriksson.me/✂️🔗/) to [https://hlaueriksson.github.io/jekyll-url-shortener/](https://hlaueriksson.github.io/jekyll-url-shortener/)

## Why?

Why would you create your own URL Shortener?

With `Jekyll URL Shortener` you could:

* Have a vanity or branded domain name
* Create neat custom slugs for the short links
* Create short links with emoji
* Track short links with Google Analytics

## Credit

The `Jekyll URL Shortener` is made possible by:

* Jekyll: [https://jekyllrb.com](https://jekyllrb.com)
* jekyll-theme-minimal: [https://github.com/pages-themes/minimal](https://github.com/pages-themes/minimal)
* jekyll-redirect-from: [https://github.com/jekyll/jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from)
* GitHub Pages: [https://pages.github.com](https://pages.github.com)

## Disclaimer

The redirecting is done with the [`jekyll-redirect-from`](https://github.com/jekyll/jekyll-redirect-from) plugin.

> Redirects are performed by serving an HTML file with an HTTP-REFRESH meta tag which points to your destination.

So, the HTTP status codes `301` (permanent redirect), `302`, `303` or `307` (temporary redirect) are not used.
