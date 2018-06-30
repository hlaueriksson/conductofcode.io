---
layout: post
title: Serverless with Azure Functions
date: 2017-04-30 10:00:00
tags:
 - Azure
 - C#
image:
 path: vsc.png
 width: 1920
 height: 1040
---

I set out to learn about Azure Functions and this is the knowledge I have gathered so far.

To have something to work with, I decided to migrate the ASP.NET Core Web API for *"My latest online activities"* to Azure Functions.

As background, refer to these related blog posts:

* [Getting started with React]({% post_url 2016-10-31-getting-started-with-react %})
* [Continuous Delivery with Visual Studio Team Services]({% post_url 2016-12-31-continuous-delivery-with-visual-studio-team-services %})
* [Introducing CommandQuery]({% post_url 2016-08-31-introducing-commandquery %})

To get some basic understanding, read the introduction over at Microsoft Docs:

* [An introduction to Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview)

You can create your functions in the browser on the [Azure Portal](https://portal.azure.com), but I find it to be a bit cumbersome.
My approach is to use the Azure Functions CLI tool to scaffold a project, put it on GitHub and deploy to Azure Functions with continuous deployment.

## Azure Functions CLI

> Command line tool for Azure Function
>
> The Azure Functions CLI provides a local development experience for creating, developing, testing, running, and debugging Azure Functions.

Read the docs at:

* [https://github.com/Azure/azure-functions-cli](https://github.com/Azure/azure-functions-cli)

Install:

`npm i -g azure-functions-cli`

![npm i -g azure-functions-cli](npm.png)

> Install globally

Create Function App:

`func init`

![func init](func-init.png)

> Create a new Function App in the current folder. Initializes git repo.

Create Function:

`func function create`

![func function create](func-function-create.png)

> Create a new Function from a template, using the Yeoman generator

Run:

`func host start`

![func host start](func-host-start.png)

> Launches the functions runtime host

So that is what I did when I created the `latest-functions` project. I'll come back to that later.
First let's talk about my `CommandQuery` package.

## CommandQuery

> Command Query Separation (CQS) for ASP.NET Core and Azure Functions

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">CommandQuery now has support for both <a href="https://twitter.com/hashtag/AspNetCore?src=hash">#AspNetCore</a> and <a href="https://twitter.com/hashtag/AzureFunctions?src=hash">#AzureFunctions</a><a href="https://t.co/qd8QHljnfx">https://t.co/qd8QHljnfx</a><a href="https://twitter.com/hashtag/CQS?src=hash">#CQS</a></p>&mdash; Henrik Lau Eriksson (@hlaueriksson) <a href="https://twitter.com/hlaueriksson/status/858662702713098240">April 30, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Remember the background:

* [Introducing CommandQuery]({% post_url 2016-08-31-introducing-commandquery %})

To migrate the ASP.NET Core Web API project to a Azure Functions app, I first needed to extend the `CommandQuery` solution.

As a result I ended up with three packages on NuGet:

* `CommandQuery`
    * Common base functionality
* `CommandQuery.AspNetCore`
    * Command Query Separation for ASP.NET Core
* `CommandQuery.AzureFunctions`
    * Command Query Separation for Azure Functions

In this blog post I will cover the `CommandQuery.AzureFunctions` package:

> Provides generic function support for commands and queries with HTTPTriggers

To get more information about the project, read the documentation over at the GitHub repository.

Get started:

* [CommandQuery.AzureFunctions](https://github.com/hlaueriksson/CommandQuery#commandqueryazurefunctions)

Sample code:

* [CommandQuery.Sample.AzureFunctions](https://github.com/hlaueriksson/CommandQuery/tree/master/sample/CommandQuery.Sample.AzureFunctions)

When I was writing the code specific to Azure Functions, I needed to add dependencies.
It makes sense to depend on the same assembly versions as the Azure Functions hosting environment use.
Therefore, I ended up creating a project to gather that information.

## AzureFunctionsInfo

> ⚡️ Information gathered on Azure Functions by executing Azure Functions ⚡️

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I created a project to get information about available Assemblies and Types in <a href="https://twitter.com/hashtag/AzureFunctions?src=hash">#AzureFunctions</a><a href="https://t.co/L9aSd7NZ2h">https://t.co/L9aSd7NZ2h</a><a href="https://twitter.com/AzureFunctions">@AzureFunctions</a></p>&mdash; Henrik Lau Eriksson (@hlaueriksson) <a href="https://twitter.com/hlaueriksson/status/858659003622203392">April 30, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I basically wanted to get information about available `Assemblies` and `Types` in the Azure Functions hosting environment.

The code and all the information gathered can be viewed at:

* [https://github.com/hlaueriksson/AzureFunctionsInfo](https://github.com/hlaueriksson/AzureFunctionsInfo)

For example, this is some important information I found out:

* `"Newtonsoft.Json, Version=9.0.0.0, Culture=neutral, PublicKeyToken=30ad4fe6b2a6aeed"`
    * Depend on [https://www.nuget.org/packages/Newtonsoft.Json/9.0.1](https://www.nuget.org/packages/Newtonsoft.Json/9.0.1)
* `"System.Net.Http, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"`
    * Depend on [https://www.nuget.org/packages/System.Net.Http/4.0.0](https://www.nuget.org/packages/System.Net.Http/4.0.0)

The type `TraceWriter` comes from:

{% highlight json %}
{% raw %}
{
  "Type": "Microsoft.Azure.WebJobs.Host.TraceWriter",
  "Assembly": "Microsoft.Azure.WebJobs.Host, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
}
{% endraw %}
{% endhighlight %}

* Depend on [https://www.nuget.org/packages/Microsoft.Azure.WebJobs/2.0.0](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/2.0.0)

## latest-functions

Okay, so now it is time to cover the actual Azure Functions app I created.
The code was migrated from an existing ASP.NET Core Web API project.

Remember the background:

* [Getting started with React]({% post_url 2016-10-31-getting-started-with-react %})

The app has one query function to get data on my latest:

* Blog post
* GitHub repo and commit
* Instagram photo

The source code is available at:

* [https://github.com/hlaueriksson/latest-functions](https://github.com/hlaueriksson/latest-functions)

The project was created with the *Azure Functions CLI* tool:

* Language: `C#`
    * [Azure Functions C# developer reference](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-csharp)
* Template: `HttpTrigger`
    * [HTTP trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#httptrigger)
* Name: `Query`

After the scaffolding, the generated code needed to be modified.

This is the end result:

`function.json`

> Defines the function bindings and other configuration settings

{% gist hlaueriksson/7ceeded33ebe530c3456a03ba15ee489 function.json %}

* authLevel set to `anonymous`
    * No API key is required
* route `query/{queryName}` added
    * How to customize the route: [Customizing the HTTP endpoint](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#customizing-the-http-endpoint)
* method `post` added
    * Array of the HTTP methods to which the function will respond

`project.json`

> To use NuGet packages in a C# function, upload a *project.json* file to the function's folder in the function app's file system.

{% gist hlaueriksson/7ceeded33ebe530c3456a03ba15ee489 project.json %}

* Only the .NET Framework 4.6 is supported, specify `net46`
* `CommandQuery.AzureFunctions`, version `0.2.0`
    * This will make the use of queries and query handlers possible in the function

`bin` folder

> If you need to reference a private assembly, you can upload the assembly file into a `bin` folder relative to your function and reference it by using the file name (e.g. `#r "MyAssembly.dll"`).

![bin](latest-functions-query-bin.png)

* The queries and query handlers used in this function are located in `Latest.dll`
* Code: [Latest](https://github.com/hlaueriksson/latest-functions/tree/master/Latest)

Make sure that private assemblies are built with `<TargetFramework>net46</TargetFramework>`.

`run.csx`

This is the code for the actual function. Written in *scriptcs*, you can enjoy a relaxed C# scripting syntax.

{% gist hlaueriksson/7ceeded33ebe530c3456a03ba15ee489 run.csx %}

* The `#r "Latest.dll"` directive reference the query assembly from the `bin` folder
* Import the namespaces `System.Reflection` and `CommandQuery.AzureFunctions`
* Create a static instance of `QueryFunction` and inject a `QueryProcessor` with the query `Assembly`. This will make IoC container find the correct query handlers for the queries.
* Add the `string queryName` argument to the function signature so the corresponding `route` will work
* Let the `QueryFunction` handle the query and return the result

When the code is done, only four things remains to get it running in the cloud:

1. Push to [GitHub](https://github.com/), [Bitbucket](https://bitbucket.org) or [Visual Studio Team Services](https://www.visualstudio.com/team-services/)
2. Log in to the [Azure portal](https://portal.azure.com)
3. [Create a function app](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function#create-a-function-app)
4. [Set up continuous deployment](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment#set-up-continuous-deployment)

The end result of all this can be viewed at:

* [http://henrik.laueriksson.com/latest/](http://henrik.laueriksson.com/latest/)

The code for the SPA that uses the function:

* [https://github.com/hlaueriksson/latest](https://github.com/hlaueriksson/latest)

## Testing

While building your functions, you want to test early and often.

Run the functions locally with the command:

`func host start`

If you need to specific CORS origins use something like:

`func host start --cors http://localhost:3000`

When the functions are running locally you can manually test them with tools like *Postman* or *curl*.

Advice from Microsoft:

* [Strategies for testing your code in Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-test-a-function)

### Postman

![Postman](postman.png)

The Postman collection for this function:

* [latest-functions.postman_collection.json](latest-functions.postman_collection.json)
    * With both local and cloud endpoints

### curl

Commands for this function hitting the cloud endpoints:

`curl -X POST http://latest-functions.azurewebsites.net/api/query/BlogQuery -H "content-type: application/json" -d "{}"`

`curl -X POST http://latest-functions.azurewebsites.net/api/query/GitHubQuery -H "content-type: application/json" -d "{'Username': 'hlaueriksson'}"`

`curl -X POST http://latest-functions.azurewebsites.net/api/query/InstagramQuery -H "content-type: application/json" -d "{}"`

### Resources

Other people are testing the functions with code:

* [Testing Azure Functions in Emulated Environment with ScriptCs](https://blog.kloud.com.au/2016/09/05/testing-azure-functions-in-emulated-environment-with-scriptcs/)
* [Testing Precompiled Azure Functions](https://blog.kloud.com.au/2017/01/20/testing-precompiled-azure-functions/)
* [Building, testing and deploying precompiled Azure Functions](https://mobilefirstcloudfirst.net/2017/01/building-testing-deploying-precompiled-azure-functions/)

If you are using `CommandQuery` together with Azure Functions you can unit test your command and query handlers.

For example like this:

* [Latest.Specs/Queries](https://github.com/hlaueriksson/latest-functions/tree/master/Latest/Latest.Specs/Queries)

*(Yeah, I know! Not really unit testing, but you get the point)*
