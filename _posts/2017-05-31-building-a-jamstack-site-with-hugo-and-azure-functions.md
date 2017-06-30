---
layout: post
title: Building a JAMstack site with Hugo and Azure Functions
date: 2017-05-31 20:00:00
update: 2017-06-30 12:00:00
tags:
 - Hugo
 - Azure
image:
 path: vsc.png
 width: 1920
 height: 1040
---

Modern web development architecture:

> Static site generators + JavaScript + Serverless = JAMstack

This blog post covers:

> Hugo + jQuery + Azure Functions = JAMstack

This blog post is part of a series:

1. Building a JAMstack site with Hugo and Azure Functions (this post)
2. [Managing content for a JAMstack site with Netlify CMS]({% post_url 2017-06-30-managing-content-for-a-jamstack-site-with-netlify-cms %})

![JAMstack Recipes](jamstack-recipes.png)

The example used in this blog post is a site for **jam recipes**.

Example code:

* [https://github.com/hlaueriksson/jamstack](https://github.com/hlaueriksson/jamstack)

Example site:

* [https://hlaueriksson.github.io/jamstack/](https://hlaueriksson.github.io/jamstack/)

## JAMstack

> Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.

Read all about it over at: [https://jamstack.org](https://jamstack.org)

Three things are needed:

* JavaScript
* APIs
* Markup

In this blog post the JavaScript is written with *jQuery*,
the APIs implemented with *Azure Functions*
and the markup generated with *Hugo*.

Why?

* Better Performance
* Higher Security
* Cheaper, Easier Scaling
* Better Developer Experience

Static site generators is
[The Next Big Thing](https://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/)
and it is used
[At Scale](https://www.smashingmagazine.com/2016/08/using-a-static-site-generator-at-scale-lessons-learned/).

## Hugo

> A fast and modern static website engine

[Hugo](https://gohugo.io) is a static site generator.

It's the second most popular according to [https://www.staticgen.com](https://www.staticgen.com)

Why Hugo?

* Extremely fast build times
* Runs on Windows and is easy to [install](https://gohugo.io/overview/installing/)

Scaffold a Hugo site:

`hugo new site .`

![hugo new site .](hugo-new-site.png)

Add content:

`hugo new recipe/apple-jam.md`

![hugo new recipe/apple-jam.md](hugo-new.png)

### Code

The code for the site:

* [https://github.com/hlaueriksson/jamstack/tree/master/src/site](https://github.com/hlaueriksson/jamstack/tree/master/src/site)

Configuration for the Hugo site is done in `config.toml`:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 config.toml %}

* Uses the [TOML](https://github.com/toml-lang/toml) format, located in the root folder
* The `baseURL` points to where the site is hosted on GitHub Pages

Data:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 api.toml %}

* Uses the [TOML](https://github.com/toml-lang/toml) format, located in the `data` folder
* This example is for the API URLs invoked by the JavaScript

The HTML template for the header:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 header.html %}

* HTML file located in the `layouts\partials` folder
* This example uses [Bootstrap](https://v4-alpha.getbootstrap.com/getting-started/introduction/#starter-template) template with the [Narrow jumbotron](https://v4-alpha.getbootstrap.com/examples/narrow-jumbotron/)
* Custom CSS in `app.css`, Bootstrap stylesheets from CDN
* The `body` tag gets an `id` with the current page template, will be used in the JavaScript
* The navigation is populated by pages configured with `navigation = true` in the front matter

The HTML template for the header:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 footer.html %}

* HTML file located in the `layouts\partials` folder
* Custom JS in `app.js`, third-party scripts from CDN

Content:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 apple-jam.txt %}

* Uses the [Markdown](https://guides.github.com/features/mastering-markdown/) format with [Front Matter](https://gohugo.io/content/front-matter/)
* This example is for the Apple Jam page
* The image and ingredients are stored as variables, available in templates via the [Param method](https://gohugo.io/templates/variables/#param-method)

Page Templates:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 recipe.html %}

* HTML file located in a `layouts` subfolder
* Reference the header and footer partials
* This example is for the recipe pages
* Data for the JavaScript is stored as attributes in a dedicated element
* The image and ingredients are accessed via the [Param method](https://gohugo.io/templates/variables/#param-method)
* The page markdown content is accessed with the `.Content` variable

JavaScript:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 app.js %}

* Located in the `static` folder
* This example uses [jQuery](https://jquery.com)
* The recipe page will `GET` ingredients from a Azure Function
* The submit page will `POST` recipes to a Azure Function

Hugo has a theming system, so you don't have to implement all templates yourself.

Hugo Themes:

* [https://themes.gohugo.io](https://themes.gohugo.io)

### Run and Build

Hugo provides its own webserver which builds and serves the site:

`hugo server`

![hugo server](hugo-server.png)

* In this example you can then browse `http://localhost:1313/jamstack/`

Build the Hugo site:

`hugo --destination ../../docs`

![hugo --destination ../../docs](hugo-destination.png)

* In this example the site is hosted by GitHub Pages from the `docs` folder in the git repo.

Troubleshoot the site generation with:

`hugo --verbose`

### GitHub Pages

Get the site hosted on GitHub Pages by:

1. Pushing the code to [GitHub](https://github.com)
2. [Configuring a publishing source for GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)

In this example the `docs` folder is used as publishing source:

![GitHub Pages](github-pages.png)

## Azure Functions

[Azure Functions Core Tools](https://github.com/Azure/azure-functions-cli) is a command line tool for Azure Functions

> The Azure Functions Core Tools provide a local development experience for creating, developing, testing, running, and debugging Azure Functions.

Create a function app:

`func init`

![func init](func-init.png)

Create a function:

`func function create`

![func function create](func-function-create.png)

*If you don't like the terminal, take a look at [Visual Studio 2017 Tools for Azure Functions](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/)*

### Code

The code for the API:

* [https://github.com/hlaueriksson/jamstack/tree/master/src/api](https://github.com/hlaueriksson/jamstack/tree/master/src/api)

Configuration for a function is done in `function.json`:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 function.json %}

* The `authLevel` can be set to `anonymous` in this example
* The `route` and `methods` are important to know when invoking the function from the JavaScript

The actual function is implemented in `run.csx`:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 run.csx %}

* Uses the [scriptcs](http://scriptcs.net/) format
* This example will return hard coded ingredients for the given recipe

### Run

Run the functions locally:

`func host start`

When running the Hugo site against local functions, specify CORS origins:

`func host start --cors http://localhost:1313`

![func host start --cors http://localhost:1313](func-host-start.png)

### Deployment

Get the functions hosted on Azure by:

1. Pushing the code to [GitHub](https://github.com/), [Bitbucket](https://bitbucket.org) or [Visual Studio Team Services](https://www.visualstudio.com/team-services/)
2. Log in to the [Azure portal](https://portal.azure.com)
3. [Create a function app](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function#create-a-function-app)
4. [Set up continuous deployment](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment#set-up-continuous-deployment)

In this example the Azure Functions code is located in the `\src\api\` folder in the git repo.

Therefor deploying with custom script is needed:

* [Customizing deployments](https://github.com/projectkudu/kudu/wiki/Customizing-deployments)
* [Deployment hooks](https://github.com/projectkudu/kudu/wiki/Deployment-hooks)

`.deployment`:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 .deployment %}

* Run `deploy.cmd` during deployment

`deploy.cmd`:

{% gist hlaueriksson/1385d7774044e6d6fb3840b6912f7b47 deploy.cmd %}

* Copy files from the `\src\api` folder to the repository root 

During deployment the logs look like this:

![Azure Logs](azure-logs.png)

### Configuration

Before the Hugo site and the JavaScript can invoke the Azure Functions, Cross-Origin Resource Sharing (CORS) needs to be configured.

In this example these origins are allowed:

* `https://hlaueriksson.github.io`
* `http://localhost:1313`

![Azure CORS](azure-cors.png)

Now the Hugo site can be configured to use these URLs:

* `https://jamstack.azurewebsites.net/api/Ingredients/{recipe}`
* `https://jamstack.azurewebsites.net/api/Recipe`

## Conclusion

* JAMstack is the modern web development architecture
* Static site generators is a big thing right now
* Hugo is fast and awesome
* jQuery is still useful
* Serverless is the next big thing
* Azure Functions is awesome