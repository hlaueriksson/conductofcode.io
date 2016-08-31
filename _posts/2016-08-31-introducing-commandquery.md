---
layout: post
title: Introducing CommandQuery
date: 2016-08-31 20:00:00
tags: CQS, Microservices, ASP.NET Core, C#
image:
 path: CommandQuery.png
 width: 1920
 height: 1048
---

I was interested in learning more about Command Query Separation (CQS). I ended up with a NuGet package for ASP.NET Core microservice apps.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Introducing CommandQuery - <a href="https://twitter.com/hashtag/CQS?src=hash">#CQS</a> for <a href="https://t.co/m497h64xIR">https://t.co/m497h64xIR</a> Core <a href="https://twitter.com/hashtag/Microservices?src=hash">#Microservices</a> <a href="https://twitter.com/hashtag/aspdotnetcore?src=hash">#aspdotnetcore</a> <a href="https://t.co/qd8QHljnfx">https://t.co/qd8QHljnfx</a></p>&mdash; Henrik Lau Eriksson (@hlaueriksson) <a href="https://twitter.com/hlaueriksson/status/771047534043209728">August 31, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

You can get the binaries and source at:

* NuGet: [https://www.nuget.org/packages/CommandQuery](https://www.nuget.org/packages/CommandQuery)

* GitHub: [https://github.com/hlaueriksson/CommandQuery](https://github.com/hlaueriksson/CommandQuery)

## What?

> Command Query Separation (CQS) for ASP.NET Core Microservices
>
> * Build microservices that separate the responsibility of commands and queries.
> * Focus on implementing the handlers for commands and queries, not on writing Web APIs.
> * CommandQuery provides generic actions for handling the execution of all commands and queries.
> * CommandQuery provides an API based on HTTP POST, not a REST API

[Command Query Separation](http://martinfowler.com/bliki/CommandQuerySeparation.html) in a nutshell:

* Commands
	* Writes (Create, Update, Delete) data
* Queries
	* Reads and returns data

[Microservices](http://martinfowler.com/articles/microservices.html) could be done with [ASP.NET Core](https://docs.asp.net)

## How?

Basically:

1. Create a new ASP.NET Core project
	* [Tutorials](https://docs.asp.net/en/latest/tutorials/index.html)
2. Install the `CommandQuery` package from [NuGet](https://www.nuget.org/packages/CommandQuery)
	* `PM>` `Install-Package CommandQuery`
3. Create controllers
	* Inherit from `BaseCommandController` and `BaseQueryController`
4. Create commands and command handlers
	* Implement `ICommand` and `ICommandHandler<in TCommand>`
5. Create queries and query handlers
	* Implement `IQuery<TResult>` and `IQueryHandler<in TQuery, TResult>`
6. Add the handlers to the dependency injection container
	* `services.AddCommands(typeof(Startup).GetTypeInfo().Assembly);`
	* `services.AddQueries(typeof(Startup).GetTypeInfo().Assembly);`

Sample code is available on GitHub: [CommandQuery.Sample](https://github.com/hlaueriksson/CommandQuery/tree/master/sample/CommandQuery.Sample)

## Why?

I wanted to:

* Publish my very first NuGet package
* Try ASP.NET Core / .NET Core
* Learn more about CQS

## Credit

The great articles by Steven van Deursen:

* [Meanwhile... on the command side of my architecture](https://cuttingedge.it/blogs/steven/pivot/entry.php?id=91)
* [Meanwhile... on the query side of my architecture](https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92)

## Disclaimer

I have not considered things like:

* Service Discovery
* Authentication / Authorization
* Caching
* etc.
