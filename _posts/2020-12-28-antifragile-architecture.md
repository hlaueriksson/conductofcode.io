---
layout: post
title: Antifragile Architecture
description: Antifragile Architecture and designing systems of the future
date: 2020-12-06 19:00:00
tags:
 - Architecture
 - Azure
image:
 path: /post/antifragile-architecture/antifragile-architecture.png
 width: 1600
 height: 1200
---

I was attending the training [Antifragile Architecture](https://www.dfkompetens.se/utbildning/antifragile-architecture-microsoft-azure/), given by [Barry O’Reilly](https://www.linkedin.com/in/barry-o-reilly-b924657/), back in November 2020.

The course promise to make you:

* A better engineer
* Ask better questions
* Test architectures easier

![Antifragile Architecture](antifragile-architecture.png)

## What?

With Antifragile Architecture you can build systems that have antifragile properties.

Antifragile systems have:
* Modularity
* Weak Links
* Redundancy
* Diversity

Antifragile systems have the ability to survive unknown stress.
They will cope with things they are not designed for.

Systems that appear antifragile are not designed.
They become antifragile through exposure to stress.

## Why?

Why do we need Antifragile Architecture?
Because the systems that we build fail.
And the old ways of building software are flawed.

Building software based on requirements is the problem.
In fact, Barry says:

> Asking for requirements is a form of bullying!

We need to reject the past and forget about planning, estimating and predicting the future.

The basic questions we need to answer are:

* Am I building the right thing?
* Am I building it right?

## When?

Use Antifragile Architecture when you work in a complex domain or when you are building a system that is complex.

Complex systems have:

* Non-linear responses to inputs
* Complicated interdependencies
* Emergent behavior that is unpredictable

Use the [Cynefin framework](https://en.wikipedia.org/wiki/Cynefin_framework) to make some sense of complexity and figure out if your system belongs in the complex quadrant.

## How?

Applying Antifragile Architecture involves four steps:

1. Stressor Analysis
2. Decomposition
3. Architecture Trade-Off Analysis Method
4. Failure Mode Effects Analysis

### Stressor Analysis

We will use stressors, not requirements, to architect our system.

Gather a list of stressors that can affect your business.
These can be technical failures, market changes, organizational challenges, etc.
Think about what aspects of the business are impacted by the stressors.
Come up with ways to detect when the stressors hit.
Suggest mitigations to the stressors.

Keep this in a spreadsheet:

Stressor # | Stressor | Impacts the ability to | Detection | Mitigation | Technical Mitigation
--- | --- | --- | --- | --- | ---
1 | Competitor lowers the price | Attract	customers | Market scanning | Build a better system than the competitors |
2 | Fire breathing lizards destroys the data center | Use the system | Software alert | | Scale out to multiple data centers

These are actually the first stressors that Barry thinks about when starting a new project.
Stressor #1 makes you think about the business from the start.
Stressor #2 makes you ignore probability when gathering stressors.

You can create a [Business Model Canvas](https://en.wikipedia.org/wiki/Business_Model_Canvas) and use it to identify stressors.
You can use [VUCA](https://en.wikipedia.org/wiki/Volatility,_uncertainty,_complexity_and_ambiguity) to group the stressors.

### Decomposition

Our goal here is to find the optimal structure of a software system that must exist in flux.
We will not use conventional decomposition, that typically leads to a N-tier architecture.

Instead we use _Flow First Design_, a set of techniques invented by Barry, to design a solution.

1. Identify independent process flows in your business model
2. Use Flow/Flow DSM to validate the identified flows
3. Use Stressor/Flow DSM to further validate the identified flows and isolate stressor impact
4. List the functions in each flow
5. Use a Function/Function DSM to group functions into components
6. Use a Stressor/Component DSM to get Parnas counts and further isolate stressor impact

DSM stands for [Design Structure Matrix](https://en.wikipedia.org/wiki/Design_structure_matrix) and it is used to get a visual representation of dependencies.

Use Flow/Flow DSM to validate the identified flows:

Flow/Flow | Flow A | Flow B | Flow C
--- | :---: | :---: | :---:
Flow A | X | |
Flow B | 1 | X |
Flow C | 1 | 1 | X

Make sure you have a triangle of 1's:

* If you don't have a triangle, then the flows are not dependent to each other
* If a flow has more than one dependency, it should exist on its own
* If a flow is dependent on (triggered by) more than one other flow, it should exist on its own

Use Stressor/Flow DSM to further validate the identified flows and isolate stressor impact:

Stressor/Flow | Flow A | Flow B | Flow C | _Total_
--- | :---: | :---: | :---: | ---
Stressor 1 | 1 | | | _1_
Stressor 2 | 1 | 1 | 1 | _3_
Stressor 3 | 1 | 1 | | _2_
_Total_ | _3_ | _2_ | _1_

* If a stressor hits more than one flow, then it suggests coupling between the flows
* If a flow is hit by more than one stressor, keep it isolated and consider adding a new flow

Within a flow, use a Function/Function DSM to group functions into components:

Function/Function | Function X | Function Y | Function Z
--- | :---: | :---: | :---:
Function X | X | 1 | 1
Function Y | | X
Function Z | | | X

When you know how to read these matrices you will get information about dependencies, interdependencies and complexity.
This will help you group functions into components.
From the DSM you can see if one component should be an orchestrator or if you end up with a [Markov](https://en.wikipedia.org/wiki/Markov_chain) process.

In the example above Function X can be the orchestrator of the other functions.

Use a Stressor/Component DSM to get Parnas counts and further isolate stressor impact:

Stressor/Component | Component Å | Component Ä | Component Ö | _Components changed_
--- | :---: | :---: | :---: | ---
Stressor 1 | 1 | | | _1_
Stressor 2 | 1 | 1 | 1 | _3_
Stressor 3 | 1 | | | _1_
_Component change rate_ | _3_ | _1_ | _1_

The [Parnas](https://en.wikipedia.org/wiki/David_Parnas) count here is the number of modules affected by a stressor,
and the number of stressors a component is affected by.

The goal of Flow First Design is to get the Parnas count as close to one as possible for each component.
Iterate to improve the decomposition.

If done right, the result is a system with modularity and weak links.
And a system that will withstand changes in volatility.

### Architecture Trade-Off Analysis Method

[ATAM](https://en.wikipedia.org/wiki/Architecture_tradeoff_analysis_method) is a process to manage risks in an architecture.

The ATAM process consists of nine steps. It's basically a meeting where stakeholders gather and scrutinize an architecture.

Antifragile Architecture uses a modified ATAM to review and gather feedback about architectures.

1. Present (modified) ATAM
2. Present the architecture and our understanding of the stressors
3. Capture opinions and things we have missed
4. Use the list of typical [NFR](https://en.wikipedia.org/wiki/Non-functional_requirement)'s to make sure we haven't missed any
5. Capture the growth scenarios
6. Identify conflicts between stressor mitigations
7. Use the stakeholders to put priority on these
8. Try to preserve antifragility

With this, we should have identified the truth about the system behavior.
And we can decide what in the architecture we can remove without sacrificing antifragility.

### Failure Mode Effects Analysis

[FMEA](https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis) is a process of reviewing an architecture to identify potential failure modes in a system and their causes and effects.

It's basically a spreadsheet with a list of ways a system can fail:

Component | Failure Mode | Detection | System Impact | Higher Level Impact | Mitigation
--- | --- | --- | --- | --- | ---
Component Å | Service Stopped | Health Check Alert | System interruption | Lost customer trust | Scale out
Component Ä | Service Crash | Error Alert | Errors for users | Lost revenue | Improve testing
Component Ö | DDoS Attack | Metrics Alert | Slow feedback for users | Lost customer trust | Azure Front Door

You can finalize your architecture with FMEA by:

* Identify flaws in your thinking
* Identify redundancy and diversity
* Harden the system against reality

## Conclusion

Architecture is:

> Decision Making in the Face of Ignorance

An Antifragile Architect:

* Accepts that he/she is not in control
* Use stressors, not requirements
* Use Parnas counting, not random decomposition
* Reviews, gathers feedback and hardens the architecture constantly

If you want to know more about Antifragile Architecture, listen to Barry O’Reilly appearing on:

* [Software Engineering Radio](https://www.se-radio.net/2020/01/episode-396-barry-oreilly-on-antifragile-architecture/)
* [.NET Rocks!](https://www.dotnetrocks.com/?show=1554)
* [DDD Europe 2019](https://www.youtube.com/watch?v=pMfzxmCzThI)
