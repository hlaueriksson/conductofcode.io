---
layout: post
title: Retry flaky tests with dotnet test and PowerShell
description: Introducing test.ps1, a script for running flaky tests - Keeps track of failing tests and retries them - Notifies the test framework of the current retry iteration - Makes it possible to accept a certain percentage of failing tests - Outputs the test result in a coherent way
date: 2023-03-26 19:00:00
tags:
 - NUnit
 - MSTest
 - xUnit
 - Testing
 - C#
image:
 path: /post/retry-flaky-tests-with-dotnet-test-and-powershell/terminal.png
 width: 1483
 height: 792
---

At my current client, [Nordic Leisure Travel Group](https://career.nordicleisuretravelgroup.com) , we have a large number of web tests that automates some of the QA effort.
The tests are written in [Selenium](https://www.selenium.dev) and [Playwright](https://playwright.dev).
They run on a schedule in [Jenkins](https://www.jenkins.io) and we get reports on email.
They take quite some time to run.
Unfortunately some of the tests are a bit flaky and it is hard to make them stable.

Therefore I set out trying to mitigate failed test runs by rerunning the failing tests.

A question/answer on [Stack Overflow](https://stackoverflow.com/q/61330768) inspired me to write my own test script.

My requirements were:
- Use PowerShell
- Use the `dotnet test` CLI command
- Keep track of failing tests and retry them
- Notify the test framework of the current retry iteration
- Make it possible to accept a certain percentage of failing tests
- Output the test result in a coherent way

This resulted in the following script:

- GitHub: [test.ps1](https://github.com/hlaueriksson/ConductOfCode/blob/master/TestRerun/test.ps1)
- PowerShell Gallery: [https://www.powershellgallery.com/packages/test-rerun](https://www.powershellgallery.com/packages/test-rerun)

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d test.ps1 %}

The script runs `dotnet test` and uses the trx logger result file to collect failed tests.
Then reruns the failed tests and reports the final result.

## Parameters

- `Path` - Path to the: project \| solution \| directory \| dll \| exe
  - Default value: `.` (current directory)
  - More info: [dotnet test arguments](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-test#arguments)
- `Configuration` - Build configuration for environment specific `appsettings.json` file.
  - Default value: `Debug`
  - Valid values: `Debug` \| `Release` \| `Development` \| `Production`
- `Filter` - Filter to run selected tests based on: TestCategory \| Priority \| Name \| FullyQualifiedName
  - More info: [Run selected unit tests](https://learn.microsoft.com/en-us/dotnet/core/testing/selective-unit-tests)
- `Settings` - Path to the `.runsettings` file.
  - More info: [Configure unit tests by using a .runsettings file](https://learn.microsoft.com/en-us/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file)
- `Retries` - Number of retries for each failed test.
  - Default value: `2`
  - Valid range: `1-9`
- `Percentage` - Required percentage of passed tests.
  - Default value: `100`
  - Valid range: `0-100`

## Examples

Run regression tests:

```ps1
.\test.ps1 -filter "TestCategory=RegressionTest"
```

Run FooBar smoke tests in Development:

```ps1
.\test.ps1 .\FooBar.Tests\FooBar.Tests.csproj -filter "TestCategory=SmokeTest" -configuration "Development"
```

Retry failed tests once and reports the run as green if 95% of the tests passed:

```ps1
.\test.ps1 -retries 1 -percentage 95
```

Run tests configured with a `.runsettings` file:

```ps1
.\test.ps1 -settings .\test.runsettings
```

## Output

If the tests passed, or the required percentage of tests passed, the script returns the exitcode `0`.
Otherwise the number of failed tests is returned as exitcode.

Output when successful:

![Test Rerun Successful.](successful.png)

Output when required percentage of tests passed:

![Test Rerun Successful.](successful2.png)

Output when failed:

![Test Rerun Failed.](failed.png)

Showcase:

![.\test.ps1 -filter FullyQualifiedName=ConductOfCode.NUnitTests](test.ps1.gif)

## Tests

To showcase the test script I have written some tests in three popular frameworks.

The script and tests are available in this repo:

- [https://github.com/hlaueriksson/ConductOfCode/tree/master/TestRerun](https://github.com/hlaueriksson/ConductOfCode/tree/master/TestRerun)

### NUnit

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d NUnitTests.cs %}

- The `Category` attribute corresponds to the `TestCategory` filter in the script.
- The `Retry` parameter in the `TestContext` contains the current retry iteration.

### MSTest

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d MSTestTests.cs %}

- The `TestCategory` attribute corresponds to the `TestCategory` filter in the script.
- The `Retry` property in the `TestContext` contains the current retry iteration.

### XUnit

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d XUnitTests.cs %}

- The `Trait` attribute and `TestCategory` parameter corresponds to the `TestCategory` filter in the script.
- [XUnit does not support accessing TestRunParameters](https://stackoverflow.com/a/55419149), so the current retry iteration is not available in this test framework.

### Playwright

> Playwright enables reliable end-to-end testing for modern web apps.

Web testing might be hard to get right and flaky tests can benefit from being retried.

Here is an example with [Playwright](https://playwright.dev/dotnet/) and NUnit:

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d PlaywrightTests.cs %}

- The `SetUp` method starts a trace recording if the test is in retry mode.
- The `TearDown` method exports the trace into a zip archive if the test failed.

The trace zip archives of failing tests can be examined at:

- [https://trace.playwright.dev](https://trace.playwright.dev)

A `.runsettings` file can be used to customizing Playwright options:

{% gist hlaueriksson/cde2d0fffc08935faaf7d9a58d910c3d test.runsettings %}

- More info: [Using the .runsettings file](https://playwright.dev/dotnet/docs/test-runners#using-the-runsettings-file)

Run the Playwright tests with the `.runsettings` file:

```ps1
.\test.ps1 -filter FullyQualifiedName=ConductOfCode.PlaywrightTests -settings .\test.runsettings
```

## Resources

- The test script and examples in this blog post: [GitHub](https://github.com/hlaueriksson/ConductOfCode/tree/master/TestRerun)
- The test script: [PowerShell Gallery](https://www.powershellgallery.com/packages/test-rerun)

If you use Azure Pipelines consider using the Visual Studio Test v2 task with the `rerunFailedTests` option:

- [VSTest@2](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/vstest-v2)
