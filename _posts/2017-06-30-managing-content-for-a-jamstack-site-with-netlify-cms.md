---
layout: post
title: Managing content for a JAMstack site with Netlify CMS
date: 2017-06-30 12:00:00
tags:
 - Netlify
 - Hugo
image:
 path: vsc.png
 width: 1920
 height: 1040
---

Content for the modern web development architecture:

> Headless CMS = Content Management System for JAMstack sites

This blog post covers:

> Netlify CMS for a JAMstack site built with Hugo + jQuery + Azure Functions

This blog post is part of a series:

1. [Building a JAMstack site with Hugo and Azure Functions]({% post_url 2017-05-31-building-a-jamstack-site-with-hugo-and-azure-functions %})
2. Managing content for a JAMstack site with Netlify CMS (this post)

![JAMstack Recipes](jamstack-recipes.png)

The example used in this blog post is a site for **jam recipes**.

Example code:

* [https://github.com/hlaueriksson/jamstack-cms](https://github.com/hlaueriksson/jamstack-cms)

Example site:

* [http://jamstack-cms.netlify.com](http://jamstack-cms.netlify.com)

## JAMstack

[JAMstack](https://jamstack.org) is the modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.
The previous blog post covered how to [build a JAMstack site with Hugo and Azure Functions]({% post_url 2017-05-31-building-a-jamstack-site-with-hugo-and-azure-functions %}).
This post will focus on how to add a Headless CMS to manage the content for the site.

## Headless CMS

A Headless CMS gives non-technical users a simple way to add and edit the content of a JAMstack site.
By being headless, it decouples the content from the presentation.

> A headless CMS doesn't care where it's serving its content to. It's no longer attached to the frontend, and the content can be viewed on any platform.

Read all about it over at: [https://headlesscms.org](https://headlesscms.org)

A Headless CMS can be:

* Git-based
* API-driven

In this blog post the focus is on *Netlify CMS*,
an open source, Git-based CMS for all static site generators.

> With a git-based CMS you are pushing changes to git that then triggers a new build of your site.

## Netlify CMS

> An open-source CMS for your Git workflow

Find out more at:

* [https://www.netlifycms.org](https://www.netlifycms.org)
* [https://github.com/netlify/netlify-cms](https://github.com/netlify/netlify-cms)

Why Netlify CMS?

* Integrates with any build tool
* Plugs in to any static site generator

### Setup

You can follow the [Quick Start](https://github.com/netlify/netlify-cms/blob/master/docs/quick-start.md) to install and configure Netlify CMS.

Basically do five things:

1. Sign up for Netlify:
  * [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. New site from Git
3. Register a new OAuth application in GitHub
4. Install authentication provider
5. Update the code

#### New site from Git

Go here:

* [https://app.netlify.com/start](https://app.netlify.com/start)

Then:

1. Select a git provider
2. Select a repository
3. Configure your build

![Create a new site](netlify-create-a-new-site.png)

The build configuration for this site:

![Continuous Deployment](netlify-continuous-deployment.png)

* Build command: `hugo -s src/site`
* Publish directory: `src/site/public`
* Build environment variables: `HUGO_VERSION = 0.21`

Refer to [Common configuration directives](https://www.netlify.com/docs/continuous-deployment/#common-configuration-directives) when configuring other static site generators.

#### Register a new OAuth application in GitHub

Go here:

* [https://github.com/settings/developers](https://github.com/settings/developers)

Then:

* Register a new OAuth application

![Register a new OAuth application](github-register-a-new-oauth-application.png)

* Authorization callback URL: `https://api.netlify.com/auth/done`

Take note of:

* `Client ID`
* `Client Secret`

#### Install authentication provider

Go here:

* [https://app.netlify.com](https://app.netlify.com)

Then:

* `<Site>` / Access / Authentication providers / Install provider

![Install authentication provider](netlify-install-authentication-provider.png)

Copy from GitHub:

* Key: `Client ID`
* Secret: `Client Secret`

### Code

The code for the site:

* [https://github.com/hlaueriksson/jamstack-cms/tree/master/src/site](https://github.com/hlaueriksson/jamstack-cms/tree/master/src/site)

The source code in this example is a [clone](https://help.github.com/articles/duplicating-a-repository/) of the Git repository from the previous blog post.

Some code has changed:

![WinMerge](winmerge.png)

Let's talk about the highlighted files...

To add Netlify CMS to a Hugo site, two files should be added to the `/static/admin/` folder:

* `index.html`
* `config.yml`

`index.html`:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 index.html %}

* Entry point for the Netlify CMS admin interface
* Scripts and styles from CDN
* This is a React app
* This is version `0.4`

`config.yml`:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 config.yml %}

* The backend is the GitHub repo
* The media and public folders suitable for Hugo. Images can be uploaded directly from the editor.
* Collections define the structure for content types and how the admin interface in Netlify CMS should work
* One content type for recipes is configured in this example
* The `fields` correspond to the `yaml`-formatted front matter in the generated markdown files
* The last field, `body`, is the content in generated markdown files
* You can enable the [Editorial Workflow](https://github.com/netlify/netlify-cms/blob/master/docs/editorial-workflow.md) here

Content:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 apple-jam.txt %}

* The content type from the `config.yml` generates markdown files like this
* The `yaml`-formatted front matter correspond to the `fields`
* The `body` field is the actual content

The following files needed to be modified to support the new site and the markdown files generated by the Netlify CMS.

`config.toml`:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 config.toml %}

* The `baseURL` points to the new site hosted by Netlify

`summary.html`:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 summary.html %}

* Images can be uploaded directly from the editor to a dedicated folder in the Git repo
* The full URL to the image comes from the front matter

`recipe.html`:

{% gist hlaueriksson/2a6a672b2749c7b1785acc5991f5ee20 recipe.html %}

* The URL to the image was changed here too
* Front matter formatted with `yaml` and `toml` has a slightly different structure
* Access to the values of ingredients was changed

### Content Manager

The Netlify CMS admin interface is accessed via the `/admin/` slug.

* [http://jamstack-cms.netlify.com/admin/](http://jamstack-cms.netlify.com/admin/)

If you are a collaborator on the GitHub repo you can log in:

![Login with GitHub](netlify-cms-login-with-github.png)

After you authorize the application:

![Authorize Application](github-authorize-application.png)

You can view the content from the repo:

![Content Manager](netlify-cms-content-manager.png)

Add and edit the content from the repo:

![Edit](netlify-cms-edit.png)

## Conclusion

JAMstack sites are awesome. Headless CMSs adds even more awesomeness.

[Smashing Magazine just got 10x faster](https://www.netlify.com/blog/2017/03/16/smashing-magazine-just-got-10x-faster/) by using Hugo and Netlify CMS to move from a WordPress to a JAMstack site.
