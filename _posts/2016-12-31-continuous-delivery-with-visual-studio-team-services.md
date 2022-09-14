---
layout: post
title: Continuous Delivery with Visual Studio Team Services
date: 2016-12-31 12:00:00
last_modified_at: 2022-09-14 20:00:00
tags:
 - Continuous Delivery
 - VSTS
 - Azure
image:
 path: /post/continuous-delivery-with-visual-studio-team-services/vsts-build-log.png
 width: 1920
 height: 1048
---

Two weeks ago I went to a [meetup](https://www.meetup.com/swedish-ms-alm-devops/events/235555234/) where [Donovan Brown](https://twitter.com/donovanbrown) spoke about DevOps, Continuous Delivery and Visual Studio Team Services.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Continuous Delivery for DevOps presented by <a href="https://twitter.com/DonovanBrown">@DonovanBrown</a> <a href="https://t.co/vdnCI7Er1R">pic.twitter.com/vdnCI7Er1R</a></p>&mdash; Henrik Lau Eriksson (@hlaueriksson) <a href="https://twitter.com/hlaueriksson/status/809498672815833088">December 15, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

You can take a look at a recorded session of his talk [From 0 to DevOps](https://docs.microsoft.com/en-us/events/microsoft-techncial-summit-technical-summit-2016/keynote-donovan-brown-from-0-to-devops):

<iframe src="https://docs.microsoft.com/video/media/d5d7895f-091e-4651-aece-dcdb744b2606/day2keynotedonovanbrown_high.mp4" allowFullScreen frameBorder="0"></iframe>

I like the part in the beginning of the video where he talks about his definition:

> DevOps is the union of people, process, and products to enable continuous delivery of value to our end users.
>
>-- <cite>[Donovan Brown](http://www.donovanbrown.com/post/what-is-devops)</cite>

Back in 2008/2009 I was using TFS at work. It is nice to see how far Microsoft has come since then.

[Visual Studio Team Services](https://www.visualstudio.com/team-services/) (VSTS) offers:

* Planning
  * Agile
  * Scrum
* Source control
  * Git
* Build automation
* Continuous deployment
* Release management

You can sign up to VSTS for free and have unlimited private git repositories.

At work, I have been using products from different vendors to do the same thing:

* Jira / Trello / Pivotal Tracker
* GitHub / Bitbucket / GitLab
* TeamCity / Jenkins
* Octopus Deploy

Let's set up a DevOps pipeline with VSTS, Azure, Continuous Integration and Continuous Delivery.

## yo vsts

**Update:** The `yo vsts` project is no longer maintained. It has been superseded by [yo Team](https://github.com/DarqueWarrior/generator-team), that handles both VSTS and TFS.

`yo vsts` is a Yeoman generator that creates a complete CI/CD pipeline in VSTS from the command line.

> Automating the automation

Installation instructions:

* [http://donovanbrown.com/post/yo-vsts](http://donovanbrown.com/post/yo-vsts)

To use it you need to have:

* Visual Studio Team Services account
* Azure Subscription

`yo vsts`

![yo vsts](yo-vsts.png)

This will:

* Create Team Project
  * Process template: Scrum
  * Version control: Git
* Create Azure Service Endpoint
* Create CI build definition
* Create CD release definition
* Clone the Git repo
* Scaffold a ASP.NET Core project
  * with unit tests

> Now all you have to do is push when ready

On the VSTS site the Git repo is empty:

![VSTS Add some code](vsts-empty.png)

`git push -u origin --all`

![git push -u origin --all](git-push.png)

The code is now available on the VSTS site:

![VSTS Code](vsts-code.png)

The CI build definition:

![VSTS Build Definition](vsts-build-definition.png)

The CD release definition:

![VSTS Release Definition](vsts-release-definition.png)

We have releases for three environments on Azure:

* Dev
* QA
* Prod

After a build we get feedback with Test Results and Code Coverage:

![VSTS Build Summary](vsts-build-summary.png)

Release to Dev is done automatically after a push, but releases to QA and Prod needs manual approval:

![VSTS Release Approval](vsts-release-approval.png)

When releases to all environments are done:

![VSTS Release Summary](vsts-release-summary.png)

Then Azure looks like this:

![Azure Resources](azure-resources.png)

For all environment we have:

* Application Insights
* App Service plan
* App Service

I'm running all this in the Free Pricing Tier.

## LatestApi

I was trying out [React]({% post_url 2016-10-31-getting-started-with-react %}) before and built a [simple site](http://henrik.laueriksson.com/latest/) with a backend API.
The code for the API was on GitHub and the API itself was hosted on Azure with [continuous deployment](https://github.com/blog/2056-automating-code-deployment-with-github-and-azure) enabled.

This whole blog post was just a reason to move the API from GitHub to Visual Studio Team Services and play with Continuous Delivery.

On VSTS the repos are private. So for you to view the code i mirrored the repo on GitHub:

`git remote add github https://github.com/hlaueriksson/latest-api.git`

`git push -u github --all --force`

Take a look at: [https://github.com/hlaueriksson/latest-api](https://github.com/hlaueriksson/latest-api)
