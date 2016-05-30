---
layout: post
title: Behavior-driven development with NUnit
date: 2016-04-30 20:00:00
tags: BDD, NUnit, Testing, C#
image:
 path: vs.png
 width: 1920
 height: 1048
---

How can I make my unit testing with NUnit feel more like behavior-driven development?

I work with .NET and C#. I like to test my own code. I try to do [TDD](https://en.wikipedia.org/wiki/Test-driven_development) and [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development). My favorite framework for testing is [Machine.Specifications](https://github.com/machine/machine.specifications).

I like `Given`, `When`, `Then` over `Arrange`, `Act`, `Assert`.

I like `Should` instead of `Assert`.

At work we use:

* [NUnit](http://www.nunit.org/)
* [Moq](https://github.com/moq/moq4)

Ok, so how can I make NUnit do *Given, When, Then* and feel more *BDD*? With as little effort as possible? I want to read the result in the test runner in as fluent english as possible. I do not want to write my own framework.

My solution:

1. Use folders prefixed with `Given_` to group tests for a specific *subject* and *context*
2. Use classes prefixed with `When_` to group specific actions to be tested
3. Use test case methods prefixed with `Should_` to describe the behavior
4. Use a [Should](https://github.com/erichexter/Should) library for the assertions

A folder prefixed with `Given_` will generate a namespace prefixed with `Given_`. The name of the folder can end with the name of the *subject / class under test*. `Given_Foo`. Or it can end in something that describes the context for the subject in a more specific way. `Given_Foo_with_bar`.

The name of the class can end with the name of the *method / property / member* to be tested. `When_GetFoo`. Or it can end in something that describes the action in a more fluent language. `When_getting_the_foo`.

The name of the test case methods should describe the behavior of the code that is tested. `Should_return_foo_if_bar_is_configured`. Create as many case methods as needed to describe all the behaviors of the code under test. Ideally each test case method should only contain a single assertion. It will make it easier to understand why tests fail.

Use `Snake_case` as naming convention for folders, classes and methods.

## Example code

You can get the example code at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

The subject:

{% gist hlaueriksson/f95ff2ef7e0c4ce234400b6727b9c94f HelloWorld.cs %}

The tests:

{% gist hlaueriksson/f95ff2ef7e0c4ce234400b6727b9c94f When_GetMessage.cs %}

The solution explorer:

![Solution Explorer](solution-explorer.png)

The unit test explorer:

![Unit Test Explorer](unit-test-explorer.png)

The unit test sessions:

![Unit Test Sessions](unit-test-sessions.png)

If you use **ReSharper** as test runner you can use the *Group by: Projects and Namespaces* option to get the output as seen above.
