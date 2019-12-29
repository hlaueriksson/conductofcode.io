---
layout: post
title: Introducing LoFuUnit
description: Testing with Local Functions in .NET / C# with your favorite Unit Testing Framework
date: 2019-12-29 19:00:00
tags:
 - BDD
 - Testing
 - C#
image:
 path: /post/introducing-lofuunit/LoFuUnit.png
 width: 1600
 height: 1200
---

About a year ago I was experimenting with _local functions_ and _reflection_, to improve my unit tests and the way to write BDD specs.
I had been using [Machine.Specifications](https://github.com/machine/machine.specifications) and [Machine.Fakes](https://github.com/machine/machine.specifications.fakes) for years.
MSpec has served me well, but the lack of [async support](https://github.com/machine/machine.specifications/issues/293) made me look for alternatives.

The experiment with local functions in tests led to the release of LoFuUnit:

* NuGet: [https://www.nuget.org/packages?q=owners%3Ahlaueriksson+title%3ALoFuUnit](https://www.nuget.org/packages?q=owners%3Ahlaueriksson+title%3ALoFuUnit)
* GitHub: [https://github.com/hlaueriksson/LoFuUnit](https://github.com/hlaueriksson/LoFuUnit)

> Testing with **Lo**cal **Fu**nctions 🐯
>
> in .NET / C# ⚙️
>
> with your favorite **Unit** Testing Framework ✔️

Recently I published version `1.1.1` of LoFuUnit, so I thought it would be a good time to introduce the framework to you in the form of a blog post.

## Tests

Let's try LoFuUnit and see how tests are written. I'll use the same challenge from a previous blog post about [BDD frameworks for .NET / C#]({% post_url 2016-07-30-bdd-frameworks-for-dotnet-csharp %}):

**The subject**

The stack, a last-in-first-out (LIFO) collection:

* [`Stack<T>`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1)

The tests will assert the behavior of:

* Empty vs nonempty stack
* `Peek()` and `Pop()` methods
* `InvalidOperationException`

![Stack](Stack.png)

Tests with [LoFuUnit.NUnit](https://www.nuget.org/packages/LoFuUnit.NUnit/):

{% gist hlaueriksson/79f1dc868fbfc11c65cb8e33d58c0490 StackTests.cs %}

* `LoFuUnit.NUnit` provides the `[LoFu]` attribute, apply it to your test methods
* Write the test steps in local functions, they are implicitly invoked by the `[LoFu]` attribute
* Think about the naming of test methods and test functions, it will determine the test output

Test output:

![Unit Test Sessions](result1.png)

![Unit Test Sessions](result2.png)

## Auto Mocks

> Mocking is nice, automocking is even better

Auto-mocking is part of LoFuUnit.
Let's see how auto-mocked tests are written. I'll use the same challenge from a previous blog post about [Automocked base class for NUnit tests]({% post_url 2016-05-30-automocked-base-class-for-nunit-tests %}):

The subject:

{% gist hlaueriksson/79f1dc868fbfc11c65cb8e33d58c0490 HelloWorld.cs %}

Auto-mocked tests with [LoFuUnit.AutoNSubstitute](https://www.nuget.org/packages/LoFuUnit.AutoNSubstitute/) and [LoFuUnit.NUnit](https://www.nuget.org/packages/LoFuUnit.NUnit/):

{% gist hlaueriksson/79f1dc868fbfc11c65cb8e33d58c0490 HelloWorldTests.cs %}

* `LoFuUnit.AutoNSubstitute` provides the base class `LoFuTest<TSubject>`, inherit your test fixtures from it
* The `Use<TDependency>()` methods gives you the ability to setup the mocks
* The `The<TDependency>()` method lets you access the mocks and verify expectations

Test output:

![Unit Test Sessions](result3.png)

## Installation

LoFuUnit is distributed as [7 packages](https://www.nuget.org/packages?q=owners%3Ahlaueriksson+title%3ALoFuUnit) via NuGet.
The code examples in this blog post used two of them.

`LoFuUnit.NUnit`:

<iframe src="https://nuget-install-tabs.azurewebsites.net/api/LoFuUnit.NUnit" style="border-style:none; width:750px; height:112px;"></iframe>

`LoFuUnit.AutoNSubstitute`:

<iframe src="https://nuget-install-tabs.azurewebsites.net/api/LoFuUnit.AutoNSubstitute" style="border-style:none; width:750px; height:112px;"></iframe>

You can view the code examples from this blog post at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)
