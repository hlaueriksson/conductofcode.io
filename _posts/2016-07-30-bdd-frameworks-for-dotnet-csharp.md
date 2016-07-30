---
layout: post
title: BDD frameworks for .NET / C#
date: 2016-07-30 20:00:00
tags: BDD, Testing, C#
image:
 path: unit-test-sessions.png
 width: 1920
 height: 1048
---

What BDD frameworks for .NET / C# are actively maintained? Let's try some of them out!

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What <a href="https://twitter.com/hashtag/BDD?src=hash">#BDD</a> frameworks for <a href="https://twitter.com/hashtag/dotnet?src=hash">#dotnet</a> / <a href="https://twitter.com/hashtag/csharp?src=hash">#csharp</a> are missing from <a href="https://twitter.com/dwozn">@dwozn</a> list at <a href="https://t.co/Ad1i9bU2Zs">https://t.co/Ad1i9bU2Zs</a></p>&mdash; Henrik Lau Eriksson (@hlaueriksson) <a href="https://twitter.com/hlaueriksson/status/757489145073770496">July 25, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I will try actively maintained projects that:

* Is open source
* Is available on **NuGet**
* Has published a release this year

I group the frameworks into two categories:

* Behavior-driven development (BDD)
	* Specifications written and read by *developers*.
* Specification by example (SBE)
	* Specifications written and read *developers*, *testers* and *business analysts* (Three Amigos).

Frameworks for **Behavior-driven development**:

* [LightBDD](#lightbdd)
* [Machine.Specifications (MSpec)](#machinespecifications-mspec)
* [NSpec](#nspec)
* [SpecsFor](#specsfor)
* [xBehave.net](#xbehavenet)

Frameworks for **Specification by example**:

* [Concordion.NET](#concordionnet)
* [SpecFlow](#specflow)

I'll use ReSharper as my testrunner when it's possible.

You can view the code at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

## The subject

The stack, a last-in-first-out (LIFO) collection:

* [`Stack<T>`](https://msdn.microsoft.com/en-us/library/3278tedw.aspx)

The specifications will test the behavior of:

* Empty vs non empty stack
* `Peek()` and `Pop()` methods
* `InvalidOperationException`

![Stack](Stack.png)

Now I will let the code speak for itself...

## LightBDD

* Dependencies: NUnit &#124; MbUnit &#124; MsTest &#124; xUnit
* NuGet: [https://www.nuget.org/packages/LightBDD/](https://www.nuget.org/packages/LightBDD/)
* Source: [https://github.com/Suremaker/LightBDD](https://github.com/Suremaker/LightBDD)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 LightBDD-Stack_feature.cs %}

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 LightBDD-Stack_feature.Steps.cs %}

![LightBDD](LightBDD.png)

Console output during test execution:

{% highlight txt %}
FEATURE: [LIFO] Stack feature
  In order to support last-in-first-out (LIFO) operations
  As an developer
  I want to use a stack
{% endhighlight %}

{% highlight txt %}
SCENARIO: [Empty] Empty stack
  STEP 1/4: GIVEN an empty stack...
  STEP 1/4: GIVEN an empty stack (Passed after <1ms)
  STEP 2/4: THEN it has no elements...
  STEP 2/4: THEN it has no elements (Passed after 1ms)
  STEP 3/4: AND it throws an exception when calling pop...
  STEP 3/4: AND it throws an exception when calling pop (Passed after 2ms)
  STEP 4/4: AND it throws an exception when calling peek...
  STEP 4/4: AND it throws an exception when calling peek (Passed after <1ms)
  SCENARIO RESULT: Passed after 17ms
{% endhighlight %}

{% highlight txt %}
SCENARIO: [Not empty] Non empty stack
  STEP 1/7: GIVEN a non empty stack...
  STEP 1/7: GIVEN a non empty stack (Passed after 1ms)
  STEP 2/7: WHEN calling peek...
  STEP 2/7: WHEN calling peek (Passed after <1ms)
  STEP 3/7: THEN it returns the top element...
  STEP 3/7: THEN it returns the top element (Passed after 5ms)
  STEP 4/7: BUT it does not remove the top element...
  STEP 4/7: BUT it does not remove the top element (Passed after <1ms)
  STEP 5/7: WHEN calling pop...
  STEP 5/7: WHEN calling pop (Passed after <1ms)
  STEP 6/7: THEN it returns the top element...
  STEP 6/7: THEN it returns the top element (Passed after <1ms)
  STEP 7/7: AND it removes the top element...
  STEP 7/7: AND it removes the top element (Passed after <1ms)
  SCENARIO RESULT: Passed after 17ms
{% endhighlight %}

View the commit on GitHub: [513f0fce52ce63073fe662f9a1279b879399d99d](https://github.com/hlaueriksson/ConductOfCode/commit/513f0fce52ce63073fe662f9a1279b879399d99d)

## Machine.Specifications (MSpec)

* Dependencies: -
* NuGet: [https://www.nuget.org/packages/Machine.Specifications/](https://www.nuget.org/packages/Machine.Specifications/)
* Source: [https://github.com/machine/machine.specifications](https://github.com/machine/machine.specifications)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 MSpec-StackSpecs.cs %}

![Machine.Specifications (MSpec)](MSpec.png)

View the commit on GitHub: [217e02c329bb8590e3aade6f5d0ff44d1ba14e6e](https://github.com/hlaueriksson/ConductOfCode/commit/217e02c329bb8590e3aade6f5d0ff44d1ba14e6e)

## NSpec

* Dependencies: -
* NuGet: [https://www.nuget.org/packages/nspec/](https://www.nuget.org/packages/nspec/)
* Source: [https://github.com/mattflo/nspec](https://github.com/mattflo/nspec)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 NSpec-stack_specs.cs %}

Run the specs from the console:

`.\packages\nspec.1.0.7\tools\NSpecRunner.exe .\ConductOfCode\bin\Debug\ConductOfCode.dll`

![NSpec](NSpec.png)

View the commit on GitHub: [dc8a8b5f65128a3a95920911cb0af60fdfd7c3a1](https://github.com/hlaueriksson/ConductOfCode/commit/dc8a8b5f65128a3a95920911cb0af60fdfd7c3a1)

## SpecsFor

* Dependencies: NUnit
* NuGet: [https://www.nuget.org/packages/SpecsFor/](https://www.nuget.org/packages/SpecsFor/)
* Source: [https://github.com/MattHoneycutt/SpecsFor](https://github.com/MattHoneycutt/SpecsFor)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 SpecsFor-StackSpecs.cs %}

![SpecsFor](SpecsFor.png)

View the commit on GitHub: [96057b2d794d54dba98ed17c09ae26b3b91f37af](https://github.com/hlaueriksson/ConductOfCode/commit/96057b2d794d54dba98ed17c09ae26b3b91f37af)

## xBehave.net

* Dependencies: xUnit
* NuGet: [https://www.nuget.org/packages/Xbehave/](https://www.nuget.org/packages/Xbehave/)
* Source: [https://github.com/xbehave/xbehave.net](https://github.com/xbehave/xbehave.net)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 Xbehave-StackFeature.cs %}

![xBehave.net](Xbehave.png)

View the commit on GitHub: [a11c641a66d284d3ef508358e371475e4056a339](https://github.com/hlaueriksson/ConductOfCode/commit/a11c641a66d284d3ef508358e371475e4056a339)

## Concordion.NET

* Dependencies: NUnit
* NuGet: [https://www.nuget.org/packages/Concordion.NET/](https://www.nuget.org/packages/Concordion.NET/)
* Source: [https://github.com/concordion/concordion.net](https://github.com/concordion/concordion.net)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 Concordion-Stack.html %}

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 Concordion-StackTest.cs %}

> Why do I get the error "no specification extensions defined for: Concordion.NET.Internal.SpecificationConfig"?

* [http://concordion.org/coding/csharp/html/#including-the-specification-in-the-dll](http://concordion.org/coding/csharp/html/#including-the-specification-in-the-dll)

![Concordion.NET](Concordion.png)

Output is written to your temp folder:

`C:\Users\<username>\AppData\Local\Temp\ConductOfCode\Concordion`

![Concordion.NET](Concordion2.png)

View the commit on GitHub: [33631d54be3986b6263d7a22fd2888513a920ea6](https://github.com/hlaueriksson/ConductOfCode/commit/33631d54be3986b6263d7a22fd2888513a920ea6)

## SpecFlow

* Dependencies: NUnit &#124; xUnit &#124; MsTest
* NuGet: [https://www.nuget.org/packages/SpecFlow/](https://www.nuget.org/packages/SpecFlow/)
* Source: [https://github.com/techtalk/SpecFlow](https://github.com/techtalk/SpecFlow)

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 SpecFlow-Stack.feature %}

{% gist hlaueriksson/d742e784fbc25babdb9059f5d3c41516 SpecFlow-StackSteps.cs %}

![SpecFlow](SpecFlow.png)

View the commit on GitHub: [3c468931d7eb71e0fff2840200a25f67f5a0d273](https://github.com/hlaueriksson/ConductOfCode/commit/3c468931d7eb71e0fff2840200a25f67f5a0d273)

## Popularity

At the time of writing, based on the number of downloads from NuGet, the most popular frameworks are:

1. SpecFlow <!--740,669-->
2. Machine.Specifications (MSpec) <!--299,942-->
3. SpecsFor <!--34,232-->
4. NSpec <!--31,398-->
5. xBehave.net <!--28,195-->
6. LightBDD <!--2,174-->
7. Concordion.NET <!--1,340-->
