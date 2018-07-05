---
layout: post
title: Easy Approach to Requirements Syntax and the segue to Behavior Driven Development
date: 2017-07-31 20:00:00
last_modified_at: 2017-08-15 12:00:00
tags:
 - Requirements
 - SpecFlow
image:
 path: vs.png
 width: 1920
 height: 1048
---

I was attending a conference six months ago and listened to a talk about [quality](http://swetugg.se/swetugg-2017/speakers/jonas-gauffin#med-fokus-pa-kvalitet).
During the talk, I was introduced to EARS — Easy Approach to Requirements Syntax.
This way of writing requirements struck a chord with me, given my prior experience reading and writing requirement specifications.

When doing agile development, we write *User Stories* and define *Acceptance Criteria*.

> As a `<role>`, I want `<goal/desire>` so that `<benefit>`

When doing BDD, we follow this format:

> In order to `<receive benefit>`, as a `<role>`, I want `<goal/desire>`

It's not always easy to go from user stories and acceptance criteria to start writing tests.

I think that with *Easy Approach to Requirements Syntax* in place, it will be easier to do *Behavior Driven Development*.

When doing Hypothesis Driven Development, we follow this format:

> We believe `<this capability>`
>
> Will result in `<this outcome>`
>
> We will know we have succeeded when `<we see a measurable signal>`

So my hypothesis is:

> I believe using *Easy Approach to Requirements Syntax*
>
> Will result in easier implementation of *Behavior Driven Development*
>
> I will know I have succeeded when business people can actually write the (SpecFlow) feature files themselves ☺

## Easy Approach to Requirements Syntax

EARS was created during a case study at Rolls-Royce on requirements for aircraft engine control systems.

They identified eight major problems with writing requirements in an unstructured natural language:

> * Ambiguity (a word or phrase has two or more different meanings).
> * Vagueness (lack of precision, structure and/or detail).
> * Complexity (compound requirements containing complex sub-clauses and/or several interrelated statements).
> * Omission (missing requirements, particularly requirements to handle unwanted behavior).
> * Duplication (repetition of requirements that are defining the same need).
> * Wordiness (use of an unnecessary number of words).
> * Inappropriate implementation (statements of how the system should be built, rather than what it should do).
> * Untestability (requirements that cannot be proven true or false when the system is implemented).

To overcome or reduce the effects of these problems they came up with a rule set with five simple templates.

Requirements are divided into five types:

* Ubiquitous
* Event-driven
* State-driven
* Unwanted behaviors
* Optional features

### Ubiquitous

> The `<system name>` shall `<system response>`

### Event-driven

> When `<optional preconditions>` `<trigger>`, the `<system name>` shall `<system response>`

### State-driven

> While `<in a specific state>`, the `<system name>` shall `<system response>`

### Unwanted behaviors

> If `<optional preconditions>` `<trigger>`, then the `<system name>` shall `<system response>`

### Optional features

> Where `<feature is included>`, the `<system name>` shall `<system response>`

## The Stack Class

Let's put this to the test with the [`Stack<T>` Class](https://msdn.microsoft.com/en-us/library/3278tedw(v=vs.110).aspx) as the example.

This is some of the documentation from MSDN:

> Represents a variable size last-in-first-out (LIFO) collection of instances of the same specified type.

> The capacity of the `Stack<T>` is the number of elements that the `Stack<T>` can store. `Count` is the number of elements that are actually in the `Stack<T>`.

> Three main operations can be performed on a `Stack<T>` and its elements:
>
> * `Push` inserts an element at the top of the `Stack<T>`.
> * `Pop` removes an element from the top of the `Stack<T>`.
> * `Peek` returns an element that is at the top of the `Stack<T>` but does not remove it from the `Stack<T>`.

If we were to write a *User Story* in BDD format:

> In order to store instances of the same specified type in last-in-first-out (LIFO) sequence
>
> As a developer
>
> I want to use a `Stack<T>`

If we were to write requirements with *EARS* templates:

### Ubiquitous

> The `Stack<T>` shall store instances of the same specified type in last-in-first-out (LIFO) order.

> The `Stack<T>` shall return the number of elements contained when the property `Count` is invoked.

### Event-driven

> When the method `Push` is invoked, the `Stack<T>` shall insert the element at the top.

> When the method `Pop` is invoked, the `Stack<T>` shall remove and return the element at the top.

> When the method `Peek` is invoked, the `Stack<T>` shall return the element at the top without removing it.

### State-driven

> While an element is present, the `Stack<T>` shall return `true` when the method `Contains` is invoked.

> While an element is not present, the `Stack<T>` shall return `false` when the method `Contains` is invoked.

### Unwanted behaviors

> If empty and the method `Pop` is invoked, then the `Stack<T>` shall throw `InvalidOperationException`.

> If empty and the method `Peek` is invoked, then the `Stack<T>` shall throw `InvalidOperationException`.

### Optional features

> Where instantiated with a specified collection, the `Stack<T>` shall be prepopulated with the elements of the collection.

## Behavior Driven Development

Let's take this to the next level with BDD and SpecFlow.

{% gist hlaueriksson/3bd543bc6466e3eb5ecd1ab87d952563 Stack.feature %}

* Each requirement has its own scenario
* I've tagged the scenarios with the type of requirement for clarity

{% gist hlaueriksson/3bd543bc6466e3eb5ecd1ab87d952563 StackSteps.cs %}

In my opinion, it was easy to write the tests.
I copy-and-pasted the requirement to the SpecFlow feature file and then I knew exactly how many scenarios I needed to implement.
I think the examples in the scenarios makes the requirements easier to understand and reason about.
Maybe this should be called *Requirements by Example*?

## The BDD Cycle

When implementing the production code, we can use *The BDD Cycle* described in [The RSpec Book](https://pragprog.com/book/achbd/the-rspec-book).

![The BDD Cycle](the-bdd-cycle.jpg)

* A photo of page 10 from my copy of The RSpec Book
* As a .NET developer, you can replace *Cucumber* with *SpecFlow* and *RSpec* with *Machine.Specifications*

The BDD Cycle introduces two levels of testing.
We can use *SpecFlow* to focus on the high-level behavior, the requirements.
And use *Machine.Specifications* to focus on more granular behavior, unit testing code in isolation.

## Resources

* [Easy approach to requirements syntax (EARS)](https://www.researchgate.net/publication/224079416_Easy_approach_to_requirements_syntax_EARS)
by Alistair Mavin et al. The six-page research paper.

* [EARS quick reference sheet](https://aaltodoc.aalto.fi/bitstream/handle/123456789/12861/D5_uusitalo_eero_2012.pdf)
[PDF] from Aalto University. A two-page summary.

* [EARS: The Easy Approach to Requirements Syntax](https://www.iaria.org/conferences2013/filesICCGI13/ICCGI_2013_Tutorial_Terzakis.pdf)
[PDF] by John Terzakis. A 66-page presentation on EARS and how it is used at Intel.

* The source code for the example in this blog post: [GitHub](https://github.com/hlaueriksson/ConductOfCode/tree/master/EARS/ConductOfCode)

* [SpecFlow](https://github.com/techtalk/SpecFlow)

* [Machine.Specifications](https://github.com/machine/machine.specifications)
