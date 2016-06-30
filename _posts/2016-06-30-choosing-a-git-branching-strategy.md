---
layout: post
title: Choosing a Git branching strategy
date: 2016-06-30 19:00:00
tags: Git
image:
 path: git.png
 width: 1918
 height: 1039
---

If you are using [Git](https://git-scm.com) as your *version control system*, you may want to have a strategy to manage your branches.

Two popular strategies are:

* Git Flow
* GitHub Flow

At work we use these tools:

* [.NET](https://dot.net)
* [Bitbucket Server](https://bitbucket.org/product/server) as on premise Git server
* [SourceTree](https://www.sourcetreeapp.com/) as Git client (most developers)
* [TeamCity](https://www.jetbrains.com/teamcity/) for continuous integration
* [Octopus Deploy](https://octopus.com) for automated deployment

## Git Flow

Detailed description of the flow:

* [http://nvie.com/posts/a-successful-git-branching-model/](http://nvie.com/posts/a-successful-git-branching-model/)
* [https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

In this flow you end up with the branches:

* `master`
* `develop`
* `feature/*`, for example `feature/foo`
* `release/*`, for example `release/v1.0`
* `hotfix/*`, for example `hotfix/bar`

[SourceTree](https://blog.sourcetreeapp.com/2012/08/01/smart-branching-with-sourcetree-and-git-flow/) can help you to get started with Git Flow:

![SourceTree - Initialise repository for Git Flow](sourcetree-git-flow-initialise-repository.png)
![SourceTree - Choose next flow action](sourcetree-git-flow-choose-next-flow-action.png)

Who should use Git Flow?

> For teams that have to do formal releases on a longer term interval (a few weeks to a few months between releases), and be able to do hot-fixes and maintenance branches and other things that arise from shipping so infrequently, git-flow makes sense and I would highly advocate it’s use.
>
>-- <cite>[Scott Chacon](http://scottchacon.com/2011/08/31/github-flow.html)</cite>

Criticism:

* [http://endoflineblog.com/gitflow-considered-harmful](http://endoflineblog.com/gitflow-considered-harmful)

## GitHub Flow

Detailed description of the flow:

* [http://scottchacon.com/2011/08/31/github-flow.html](http://scottchacon.com/2011/08/31/github-flow.html)
* [https://guides.github.com/introduction/flow/](https://guides.github.com/introduction/flow/)

In this flow you end up with the branches:

* `master` that always should be deployable
* feature branches with descriptive names, for example `refactor-foo-to-bar`

[GitHub Desktop](https://desktop.github.com) can help you to get started with GitHub Flow:

![GitHub Desktop - GitHub Flow](github-desktop-github-flow.png)

Who should use GitHub Flow?

> For teams that have set up a culture of shipping, who push to production every day, who are constantly testing and deploying, I would advocate picking something simpler like GitHub Flow.
>
>-- <cite>[Scott Chacon](http://scottchacon.com/2011/08/31/github-flow.html)</cite>

Criticism:

* [http://doc.gitlab.com/ee/workflow/gitlab_flow.html#github-flow-as-a-simpler-alternative](http://doc.gitlab.com/ee/workflow/gitlab_flow.html#github-flow-as-a-simpler-alternative)

## In any case

Whatever branching strategy you choose I think you should:

* Use Pull Requests
	* [GitHub](https://help.github.com/articles/using-pull-requests/), [Bitbucket](https://www.atlassian.com/git/tutorials/making-a-pull-request/), [GitLab](http://docs.gitlab.com/ce/gitlab-basics/add-merge-request.html) supports it
* Build all branches on your Continuous Integration server
	* [TeamCity](https://confluence.jetbrains.com/display/TCD9/Working+with+Feature+Branches) has support for that
* Have multiple test environments and make it easy for testers to deploy the feature branches there
	* [Octopus Deploy](https://octopus.com/blog/self-service-deployments) is good at that
* [Know exactly what you’ve deployed with Git, TeamCity and Octopus](http://www.cognim.co.uk/know-exactly-what-youve-released-with-git-teamcity-and-octopus/)
	* Give releases a name that includes the Git branch name and the CI build number
		![Octopus Deploy Dashboard](octopus-deploy-releases.png)
	* Consider, in addition to the article above, to have the release notes file with the Git commit (SHA-1 hash) exposed
		![ReleaseNotes.txt](release-notes-txt.png)
* Consider to use *feature toggles* over long lived feature branches
