---
layout: post
title: Automocked base class for NUnit tests
date: 2016-05-30 21:00:00
update: 2016-08-01 23:00:00
tags:
 - NUnit
 - Testing
 - C#
image:
 path: vs.png
 width: 1920
 height: 1048
---

Mocking is nice, automocking is even better. How can I make my [NUnit BDD specs]({% post_url 2016-04-30-behavior-driven-development-with-nunit %}) automocked?

My favorite framework for testing is [Machine.Specifications](https://github.com/machine/machine.specifications) in combination with [Machine.Fakes](https://github.com/machine/machine.fakes) for automocking support.

At work, we use:

* [NUnit](http://www.nunit.org/)
* [Moq](https://github.com/moq/moq4)

Okay, so let's create a base class that works with those conditions...

For inspiration, let's look at the [Machine.Fakes](https://github.com/machine/machine.fakes#withsubjecttsubject) `WithSubject` base class:

* The test fixture will inherit from `WithSubject<TSubject>`

> Each interface or abstract base class dependency in the constructor of the type will be filled automatically by the configured fake framework. Dependency Injection with fakes so to speak.

* Use the `Subject` property to access the class under test

> The actual subject is created on the first read access to this property.

* Use `The<TFake>()` method to access to the injected dependency

*Machine.Fakes* adds an abstraction over several mock frameworks. I'm only interested in one, **Moq**.

So my solution will use:

* [NUnit](http://www.nunit.org/)
* [Moq](https://github.com/moq/moq4)
* [Moq.AutoMocker](https://github.com/tkellogg/Moq.AutoMocker)

## Example code

You can get the example code at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

WithSubject:

{% gist hlaueriksson/ffd7e5b3f6b9074d4643e57e4f3f7ae5 WithSubject.cs %}

The `With<TFake>()` methods can be used to inject real or fake objects to the subject.

The subject:

{% gist hlaueriksson/ffd7e5b3f6b9074d4643e57e4f3f7ae5 HelloWorld.cs %}

The tests:

{% gist hlaueriksson/ffd7e5b3f6b9074d4643e57e4f3f7ae5 When_GetMessage.cs %}

The unit test sessions:

![Unit Test Sessions](unit-test-sessions.png)
