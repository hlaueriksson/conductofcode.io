---
layout: post
title: Automocking and the Dependency Inversion Principle
date: 2017-02-28 20:00:00
tags:
 - xUnit
 - Testing
 - C#
image:
 path: vs.png
 width: 1920
 height: 1048
---

I had reason to revisit the [automocked base class]({% post_url 2016-05-30-automocked-base-class-for-nunit-tests %}) from a previous blog post.
I am working with another code base and have new opportunities for automocking.
We have a lot of *internal* classes.
Approximately 30% of the classes are marked as internal.
The old approach did not work anymore.

With an internal subject, I got this error:

![CS0060](CS0060.png)

`Inconsistent accessibility: base class 'WithSubject<HelloWorld>' is less accessible than class 'When_GetMessage'`

## The Dependency Inversion Principle

The D in SOLID stands for the *Dependency Inversion Principle*:

> A. High-level modules should not depend on low-level modules. Both should depend on abstractions.
> B. Abstractions should not depend on details. Details should depend on abstractions.

In other words:

> Depend on abstractions, not on concretions.

One way to enforce this between projects in C# is to make classes `internal`.

## The internal access modifier

The [`internal`](https://msdn.microsoft.com/en-us/library/7c5ka91b.aspx) access modifier:

> Internal types or members are accessible only within files in the same assembly

This is useful:

> A common use of internal access is in component-based development because it enables a group of components to cooperate in a private manner without being exposed to the rest of the application code.

How can the unit tests access the internal classes then?

The [`[InternalsVisibleTo]`](https://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.internalsvisibletoattribute(v=vs.110).aspx) attribute:

> types that are ordinarily visible only within the current assembly are visible to a specified assembly.

We will add the attribute to the AssemblyInfo file in the project under test, to make the unit test project a friend assembly.

We will use an IoC container to configure the creation of the internal classes.
The clients will depend on public interfaces and the IoC container.

## WithFakes

My favorite framework for testing is still [Machine.Specifications](https://github.com/machine/machine.specifications) in combination with [Machine.Fakes](https://github.com/machine/machine.fakes) for automocking support.

At work we use:

* [xUnit.net](https://xunit.github.io/)
* [Moq](https://github.com/moq/moq4)

I will mimic the [Machine.Fakes](https://github.com/machine/machine.fakes#withfakes) `WithFakes` base class:

* The test fixture will inherit from `WithFakes`

* Use `The<TFake>()` method for creating fakes

My implementation will use:

* [xUnit.net](https://xunit.github.io/)
* [Moq](https://github.com/moq/moq4)
* [Moq.AutoMocker](https://github.com/tkellogg/Moq.AutoMocker)

## Code

You can get the example code at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

**WithFakes**

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 WithFakes.cs %}

The `Subject<TSubject>()` method gives access the class under test.
This is how the error `Inconsistent accessibility: base class 'WithSubject<HelloWorld>' is less accessible than class 'When_GetMessage'` is solved.

The `The<TFake>()` method gives access to the injected dependencies from the subject.

The `With<TFake>()` methods can be used to inject real or fake objects into the subject.

**The subject**

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 HelloWorld.cs %}

The interfaces are `public`, the concrete classes are `internal`.

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 HelloWorldRegistry.cs %}

The creation of internal classes is configured with [StructureMap](https://github.com/structuremap/structuremap), the IoC container we are using.

The `AssemblyInfo.cs` is also modified to make the subject accessible for the unit tests:

 `[assembly: InternalsVisibleTo("ConductOfCode.Tests")]`.

**The client**

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 Program.cs %}

The client depends on interfaces and uses the IoC container to create concrete classes.

![ConductOfCode.exe](ConductOfCode.exe.png)

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 IoC.cs %}

The IoC container scans the assemblies for registries with configuration.

**The tests**

{% gist hlaueriksson/fceb24a6d9fb591519a5988be25dc191 When_GetMessage.cs %}

The `Subject` property gives access to the automocked instance via the `Subject<TSubject>()` method from the base class.

The `With<TFake>()` methods can be used to inject and setup mocks.

The `The<TFake>()` method is used for setup and verification of mocks.

**The unit test sessions**

![Unit Test Sessions](unit-test-sessions.png)
