---
layout: post
title: Entities and Value Objects in C# for DDD
date: 2016-11-30 22:00:00
update: 2016-12-31 12:00:00
tags:
 - DDD
 - C#
image:
 path: vs.png
 width: 1920
 height: 1048
---

Last week I went to a [meetup](https://www.meetup.com/Swenug-Stockholm/events/235235223/) arranged by Swenug about DDD. I got reminded of the concept behind Entities and Value Objects and the code that we wrote at my previous job.

The scope of this post is to focus on constructors, validation and the protection of the domain.

You view the example code in this post at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

## Domain Driven Design

The term was coined by Eric Evans. Check out his [book](http://dddcommunity.org/book/evans_2003/) on the subject.

With DDD we

> focus on the core domain and domain logic

and value the

> collaboration between technical and domain experts

Two important building blocks when we talk about code are *entities* and *value objects*.

## Entities

> An object fundamentally defined not by its attributes, but by a thread of continuity and identity.

An entity:

* has an identity
* contains value objects
* may contain other entities
* can be mutable

Lets use `Customer` as an example:

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 Customer.cs %}

Our customer has an identity and two value objects.
All of this state is passed via the parameterized constructor.
There is no default constructor.
The properties are read-only.
This makes it possible to do validation.
We make sure that created customers are in a *valid state* and are kept in a valid state.
We make sure to *fail-fast*.

Our customer is immutable, but it doesn't need to be.
In a real code base the customer class should encapsulate it's own domain logic.
This makes it is easier to protect the entity from invalid state.

### Specs

It is nice to be confident of the validation in your entities by test driving the code.

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 CustomerSpecs.cs %}

I'm using [Machine.Specifications](https://github.com/machine/machine.specifications) as the test framework in this blog post. The test result looks like this:

![CustomerSpecs](CustomerSpecs.png)

### Debugger Display

One useful thing while debugging code that interacts with your entities is the `DebuggerDisplay` attribute.

In the example with our customer we will display the email for quick identification.

![DebuggerDisplay](DebuggerDisplay.png)

## Value Objects

> An object that describes some characteristic or attribute but carries no concept of identity.

A value object:

* does not have an identity
* must be immutable

Continuing with the `Customer` example. Our customer has a name:

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 Name.cs %}

Here we group the first and last name into a value object.
We don't store them directly as separate properties in the customer.
This has some advantages.
We can reuse `Name` in other entities.
We can [validate](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) and make sure that when they are created, they end up in a valid state.
We make sure to fail-fast.
Once created, the name is immutable.

Let's continue with email:

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 Email.cs %}

Apart from using the customer `Id`, the *email* can also be a way of identification. And wouldn't it be convenient to sometimes just use a `string` when dealing with emails.

### Conversion Operators

In the example above, `Email` has [implicit conversion operators](https://msdn.microsoft.com/en-us/library/z5z9kes2.aspx) *from* and *to* `string`.

It can be very convenient to pass in email as a string to the customer constructor. The string will automatically be converted into an email object.

### Equality Operators

If we are using email as way of identifying customers, than we benefit from:

* overriding the `Equals` method
* implementing  the `IEquatable<T>` interface
* implementing the equality (`==`) and inequality (`!=`) operators

### Specs

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 NameSpecs.cs %}

![NameSpecs](NameSpecs.png)

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 EmailSpecs.cs %}

![EmailSpecs](EmailSpecs.png)

## AutoFixture

[AutoFixture](https://github.com/AutoFixture/AutoFixture) helps you to

> write maintainable unit tests, faster.

It is a popular library that reduce the `setup` / `arrange` code in your tests

> by making it easier to create object graphs containing test data.

Can AutoFixture handle the creation of entities and value objects without default constructors and with read-only properties?
How can we make sure the validation does not fail when creating entities and value objects?

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 AutoFixtureSpecs.cs %}

![AutoFixtureSpecs](AutoFixtureSpecs.png)

AutoFixture:

* can handle parameterized constructors
* can handle read-only properties
* can not handle validation errors, but can help you avoid them

We can use the `Register` method to specify a *creation function* to avoid validation errors and handle read-only properties.

AutoFixture is a great tool to use when the constructor *signatures* of your entities and value objects keeps on changing.
You can avoid a lot of compilation errors in your tests when you refactor the constructors.

## AutoMapper

[AutoMapper](https://github.com/AutoMapper/AutoMapper) is a

> convention-based object-object mapper.

It is a popular library that

> takes out all of the fuss of mapping one object to another. 

Can AutoMapper handle the mapping of entities and value objects without default constructors and with read-only properties?
What happens if validation fails when mapping entities and value objects?

Let's try to map our `Customer`, `Name` and `Email` to and from the corresponding *data transfer objects*.
The [DTOs](https://en.wikipedia.org/wiki/Data_transfer_object) are just [POCO](https://en.wikipedia.org/wiki/Plain_Old_CLR_Object) classes.

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 AutoMapperSpecs.cs %}

![AutoMapperSpecs](AutoMapperSpecs.png)

AutoMapper:

* can handle parameterized constructors
* can handle read-only properties
* can not handle validation errors

The mapping fails if a *DTO* is in an invalid state. No big surprise. You must deal with this yourself.

## Json.NET

[Json.NET](https://github.com/JamesNK/Newtonsoft.Json) is a

> high-performance JSON framework for .NET

It is a popular library that can

> serialize and deserialize any .NET object

Can Json.NET handle deserialization of entities and value objects without default constructors and with read-only properties?
What happens if validation fails when deserializing entities and value objects?

{% gist hlaueriksson/61bbc512efaf3ecd9dd6622306843c13 JsonSpecs.cs %}

![JsonSpecs](JsonSpecs.png)

Json.NET:

* can handle parameterized constructors
* can handle read-only properties
* can not handle validation errors

The deserialization fails if an entity or value object is in an invalid state. No big surprise. You must deal with this yourself.
