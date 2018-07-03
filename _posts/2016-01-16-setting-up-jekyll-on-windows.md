---
layout: post
title: Setting up Jekyll on Windows
date: 2016-01-16 20:50:00
update: 2018-07-03 20:50:00
tags:
 - Jekyll
 - Blogging
image:
 path: bundle-exec-jekyll-serve.gif
 width: 979
 height: 512
---

This is how I installed *Jekyll* on *Windows 10* using two approaches:

* [Chocolatey](#chocolatey)
* [Docker](#docker)

Background:

1. Jekyll requires Ruby to run
2. GitHub Pages can host Jekyll sites
3. This blog is hosted on GitHub Pages

The official instructions are found here: [https://jekyllrb.com/docs/windows/](https://jekyllrb.com/docs/windows/)

## Chocolatey

This approach runs Jekyll directly on your Windows operating system.

Open a command prompt as *Administrator*.

Install [Chocolatey](https://chocolatey.org/install):

{% highlight bat %}
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
{% endhighlight %}

### Ruby

Install [Ruby](https://chocolatey.org/packages/ruby):

{% highlight bat %}
choco install ruby
{% endhighlight %}

### Jekyll

Open a *new* command prompt, so that changes to the `PATH` environment variable becomes effective.

Install [Jekyll](https://rubygems.org/gems/jekyll/):

{% highlight bat %}
gem install bundler jekyll
{% endhighlight %}

Install Gems:

{% highlight bat %}
bundle install
{% endhighlight %}

Build and serve the site:

{% highlight bat %}
bundle exec jekyll serve
{% endhighlight %}

![bundle exec jekyll serve](bundle-exec-jekyll-serve.gif)

## Docker

This approach runs Jekyll in a Linux container with Docker using the image: [https://github.com/Starefossen/docker-github-pages](https://github.com/Starefossen/docker-github-pages)

Download and install: [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

Share your local drives (volumes) with Docker for Windows, so that they are available to your Linux containers: [Shared drives](https://docs.docker.com/docker-for-windows/#shared-drives)

Open a command prompt.

Build and serve the site with `docker run`:

{% highlight bat %}
docker run -t --rm -v %CD%:/usr/src/app -p 4000:4000 starefossen/github-pages
{% endhighlight %}

Or build and serve the site with `docker-compose`:

{% highlight bat %}
docker-compose up
{% endhighlight %}

using this `docker-compose.yml` file:

{% gist hlaueriksson/5e8c117081fd92ea355dec962b2467dc docker-compose.yml %}

![docker-compose up](docker-compose-up.gif)

## Troubleshooting

Get errors when switching between the Chocolatey and Docker approach? Try to delete the `Gemfile.lock` file!

Get errors like `driver failed programming external connectivity on endpoint` with Docker? Try to restart Docker for Windows!
