---
layout: post
title: Reuse SpecFlow features to test both via API and browser
date: 2017-01-31 20:00:00
tags:
 - BDD
 - Testing
 - C#
image:
 path: /post/reuse-specflow-features-to-test-both-via-api-and-browser/vs.png
 width: 1920
 height: 1048
---

Six months ago I was trying out different [BDD frameworks for .NET / C#]({% post_url 2016-07-30-bdd-frameworks-for-dotnet-csharp %}).
SpecFlow was one of the tools I already had experience with.
I have been using it now and then for a few years.
Recently I have been exploring a technique to *reuse* SpecFlow features to test a system from different angles.
The same scenarios can be used to test a system both via API and browser.

## Why?

Why do I want to reuse SpecFlow feature files?

I can get started with one test approach, and later change to another without rewriting the feature files.

I am forced to think hard about writing good feature files.

In general, tests via API are:

* easier to write
* easier to maintain
* faster to run

In general, tests via browser are:

* truly end-to-end

## The subject

I will be using the same subject as in the [previous]({% post_url 2016-07-30-bdd-frameworks-for-dotnet-csharp %}) blog post:

> The stack, a last-in-first-out (LIFO) collection:

> * [`Stack<T>`](https://msdn.microsoft.com/en-us/library/3278tedw.aspx)

And I will test the same things as before:

> * Empty vs nonempty stack
> * `Peek()` and `Pop()` methods
> * `InvalidOperationException`

I created a single page application as a UI for the stack. It will provide the opportunity to test the stack both via a *REST API* and via the *browser*.

The SPA is a [React + Redux app on ASP.NET Core](http://blog.stevensanderson.com/2016/05/02/angular2-react-knockout-apps-on-aspnet-core/) generated with `yo aspnetcore-spa`:

![yo aspnetcore-spa](yo-aspnetcore-spa.png)

The code for the SPA is available at: [https://github.com/hlaueriksson/ConductOfCode/tree/master/SpecFlow/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode/tree/master/SpecFlow/ConductOfCode)

To run the site:

* Install [.NET Core 1.1](https://www.microsoft.com/net/download/core#/current)
* `set ASPNETCORE_ENVIRONMENT=Development`
* `dotnet run`
* Browse `http://localhost:5000`

## SpecFlow

I will be using the same feature file as before:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 Stack.feature %}

The step definitions for testing the `Stack<T>` class directly also looks the same as before:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 StackSteps.cs %}

Both these files are located in a VS project called `ConductOfCode.Specs`.

The code is available at: [https://github.com/hlaueriksson/ConductOfCode/tree/master/SpecFlow/ConductOfCode.Specs](https://github.com/hlaueriksson/ConductOfCode/tree/master/SpecFlow/ConductOfCode.Specs)

How can we reuse the SpecFlow feature file?

1. Create a new VS project
2. Copy the feature file to the new project
3. Implement the step definitions in the new project

Step number 2 can be done by:

* Copy and paste the file
* Use `Add As Link`
* Include the file via a git submodule

I will demonstrate the *Add As Link* way.
With this approach it is important that the new VS project has the same *default namespace* as the original project.
Change the default namespace via the project properties:

![Default namespace](default-namespace.png)

Then use the right-click menu to `Add / Existing Item...`, select the feature file, and `Add As Link`:

![Add As Link](add-as-link.png)

The `csproj` will look like this:

![csproj](add-as-link-csproj.png)

With the *Add As Link* approach it matters what unit test framework you use together with SpecFlow:

* [NUnit](https://www.nuget.org/packages/SpecFlow.NUnit/) works fine with the ReSharper test runner
* [xUnit](https://www.nuget.org/packages/SpecFlow.xUnit/) has some issues with the ReSharper test runner

## Api

I created a [`StackController`](https://github.com/hlaueriksson/ConductOfCode/blob/master/SpecFlow/ConductOfCode/Controllers/StackController.cs) in the SPA project.
The class provides a REST interface for an in-memory stack.
To make the testing of the API easier, I added [Swagger](http://swagger.io) to the project with [NSwag](https://github.com/NSwag/NSwag).
The response types for each action is annotated with attributes based on HTTP status code.

Use the Swagger UI to get started with some manual testing:

![Swagger UI](swagger-ui.png)

The `ConductOfCode.Specs.Api` VS project contains the tests that hits the API.

With [NSwag.MSBuild](https://www.nuget.org/packages/NSwag.MSBuild/) I generated a client for the API from the Swagger definition:

`.\packages\NSwag.MSBuild.8.5.0\build\NSwag.exe swagger2csclient /input:http://localhost:5000/swagger/v1/swagger.json /classname:StackClient /namespace:ConductOfCode.Specs.Clients /output:./ConductOfCode.Specs.Api/Clients/StackClient.cs`

With the generated client in place, I created a synchronous facade:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 StackFacade.cs %}

The facade will be used as the subject in the step definitions. When the API changes and the client is regenerated, it is hopefully only the facade that we need to update.

The step definitions for testing the API:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 Api-StackSteps.cs %}

## Web

The React + Redux app uses the REST API to access the in-memory stack.
It is not exactly a wonder of ux and design:

![SPA](spa.png)

The `ConductOfCode.Specs.Web` VS project contains the tests that hits the browser.

The site is tested with [Coypu](https://github.com/featurist/coypu) and [Chrome](https://www.nuget.org/packages/Selenium.WebDriver.ChromeDriver/).

Access to the site is handled with the [Page Object Pattern](https://github.com/SeleniumHQ/selenium/wiki/PageObjects).

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 StackPage.cs %}

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 BasePage.cs %}

The page object will be used as the subject in the step definitions. When the site and markup changes, it is hopefully only the page object that we need to update.

The step definitions for testing the web:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 Web-StackSteps.cs %}

Together with a [Should](https://www.nuget.org/packages/Should/) library, I also like to create my own should extensions:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 PageShouldExtensions.cs %}

## Reports

[SpecResults](https://github.com/timschlechter/SpecResults) and [SpecResults.WebApp](https://github.com/timschlechter/SpecResults.WebApp) can be used to generate reports after SpecFlow runs.

[![SpecResults.WebApp](SpecResults.WebApp.png)](ConductOfCode.Specs/)

Create a base class and let your step classes inherit from it:

{% gist hlaueriksson/4106aa68a0483ad7c619619c4d4001d9 BaseSteps.cs %}

It matters what unit test framework you use together with SpecFlow:

* [xUnit](https://www.nuget.org/packages/SpecFlow.xUnit/) works fine with SpecResults
* [NUnit](https://www.nuget.org/packages/SpecFlow.NUnit/) does not work with SpecResults

## Conclusion

It is possible to reuse SpecFlow features to test a system from different angles.

![Unit Test Sessions](unit-test-sessions.png)

When writing features:

* try to be agnostic on *how* the system is tested
* avoid being too detailed in the steps
* identify the lowest common denominators between test approaches

> * Copy and paste the file

This approach is good if you don't want 100% identical feature files between projects.

The projects can have different default namespaces.

> * Use `Add As Link`

This approach is good if you want identical feature files between projects.

The projects must have the same default namespace.

Unfortunately you will get this annoying dialog when trying to open the feature file from different projects:

![This document is opened by another project.](this-document-is-opened-by-another-project.png)

> * Include the file via a git submodule

I have not tried this approach and it certainly has a bit of overhead.
