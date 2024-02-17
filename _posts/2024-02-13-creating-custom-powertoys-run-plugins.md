---
layout: post
title: Creating custom PowerToys Run plugins
description: A step by step guide on how to create community plugins for PowerToys Run
date: 2024-02-13 22:00:00
last_modified_at: 2024-02-17 21:00:00
tags:
 - PowerToys
 - Plugins
 - C#
image:
 path: /post/creating-custom-powertoys-run-plugins/vs.png
 width: 1920
 height: 1020
---

PowerToys Run is a quick launcher for Windows. It is open-source and modular for additional plugins.

Official plugins include:

- Calculator
- Unit Converter
- Value Generator
- Windows Search

At the time of writing there are 20 plugins out of the box.

If you think the official plugins are not enough, you can write our own.
The easiest way to get started is to look at what others did.

- Official plugins:
  - <https://github.com/microsoft/PowerToys/tree/main/src/modules/launcher/Plugins>
- GitHub topics with potentially interesting repos:
  - [powertoys-run](https://github.com/topics/powertoys-run)
  - [powertoys-run-plugin](https://github.com/topics/powertoys-run-plugin)

Browsing through some of the GitHub repos found above, gives you an idea of how the source code of a plugin looks like.

## Contents<!-- omit in toc -->

- [Demo Plugin](#demo-plugin)
- [Project](#project)
- [Metadata](#metadata)
- [Main](#main)
- [Interfaces](#interfaces)
  - [IPlugin](#iplugin)
  - [IPluginI18n](#iplugini18n)
  - [IDelayedExecutionPlugin](#idelayedexecutionplugin)
  - [IContextMenu](#icontextmenu)
  - [ISettingProvider](#isettingprovider)
- [Classes](#classes)
  - [PluginInitContext](#plugininitcontext)
  - [Query](#query)
  - [Result](#result)
  - [ContextMenuResult](#contextmenuresult)
- [Actions](#actions)
- [Logging](#logging)
- [Dependencies](#dependencies)
- [Tests](#tests)
- [Distribution](#distribution)
- [Resources](#resources)

## Demo Plugin

As a demo, I created a simple plugin that counts the words and characters of the query.

![Demo Plugin](demo-plugin.png)

- ActionKeyword: `demo`

Settings:

![Demo Settings](demo-settings.png)

- Count spaces: `true` \| `false`

The source code:

- <https://github.com/hlaueriksson/ConductOfCode/tree/master/PowerToysRun>

Throughout this blog post, the demo plugin will be used as an example.

## Project

Before you create your own project, first take a look at the official checklist:

- [New plugin checklist](https://github.com/microsoft/PowerToys/blob/main/doc/devdocs/modules/launcher/new-plugin-checklist.md)

Key takeaways from the checklist:

- Project name: `Community.PowerToys.Run.Plugin.<PluginName>`
- Target framework: `net8.0-windows`
- Create a `Main.cs` class
- Create a `plugin.json` file

In Visual Studio, create a new [Class Library](https://learn.microsoft.com/en-us/dotnet/core/tutorials/library-with-visual-studio) project.

The edit the `.csproj` file to look something like this:

{% gist hlaueriksson/5484a19def85f618d7a2297628486c80 Community.PowerToys.Run.Plugin.Demo.csproj %}

- Platforms: `x64` and `ARM64`
- `UseWPF` to include references to WPF assemblies
- Dependencies: PowerToys and Wox `.dll` assemblies

The `.dll` files referenced in the `.csproj` file are examples of dependencies needed, depending on what features your plugin should support.

Unfortunately, these assemblies do not exist as packages on NuGet.

Therefore I like to commit these `.dll` files to the repo in a `libs` folder.

I'll copy the `x64` versions of the `.dll` files from the installation location:

- `C:\Program Files\PowerToys\`
  - Machine wide installation of PowerToys
- `%LocalAppData%\PowerToys\`
  - Per user installation of PowerToys

In the case of the `ARM64` versions of the `.dll` files, I'll build them from source.
I don't own an `ARM64` machine to install PowerToys on.

Other people like to resolve the dependencies by referencing the PowerToys projects directly.
Like the approach by Lin Yu-Chieh (Victor):

- [EverythingPowerToys](https://github.com/lin-ycv/EverythingPowerToys/wiki)

The project should start out with these files:

- `Images\*.png`
  - Typically dark and light versions of icons
- `Main.cs`
  - The starting point of the plugin logic
- `plugin.json`
  - The plugin metadata

## Metadata

Create a `plugin.json` file that looks something like this:

{% gist hlaueriksson/5484a19def85f618d7a2297628486c80 plugin.json %}

The format is described in the Dev Documentation:

- [New plugin checklist](https://github.com/microsoft/PowerToys/blob/main/doc/devdocs/modules/launcher/new-plugin-checklist.md)

## Main

Create a `Main.cs` file that looks something like this:

{% gist hlaueriksson/5484a19def85f618d7a2297628486c80 Main.cs %}

The `Main` class must have a public, static string property named `PluginID`:

```cs
public static string PluginID => "AE953C974C2241878F282EA18A7769E4";
```

- 32 digits `Guid` without hyphens
- Must match the value in the `plugin.json` file

In addition, the `Main` class should implement a few interfaces.

Let's break down the implemented *interfaces* and the *classes* used in the example above.

## Interfaces

Some interfaces of interest from the `Wox.Plugin` assembly:

- `IPlugin`
- `IPluginI18n`
- `IDelayedExecutionPlugin`
- `IContextMenu`
- `ISettingProvider`

### IPlugin

The most important interface is `IPlugin`:

```cs
public interface IPlugin
{
    List<Result> Query(Query query);

    void Init(PluginInitContext context);

    string Name { get; }

    string Description { get; }
}
```

- `Query` is the method that does the actual logic in the plugin
- `Init` is used to initialize the plugin
  - Save a reference to the `PluginInitContext` for later use
- `Name` ought to match the value in the `plugin.json` file, but can be localized

### IPluginI18n

If you want to support internationalization you can implement the `IPluginI18n` interface:

```cs
public interface IPluginI18n
{
    string GetTranslatedPluginTitle();

    string GetTranslatedPluginDescription();
}
```

### IDelayedExecutionPlugin

The `IDelayedExecutionPlugin` interface provides an alternative `Query` method:

```cs
public interface IDelayedExecutionPlugin
{
    List<Result> Query(Query query, bool delayedExecution);
}
```

The delayed execution can be used for queries that take some time to run.
PowerToys Run will add a slight delay before the `Query` method is invoked, so that the user has some extra milliseconds to finish typing that command.

A delay can be useful for queries that performs:

- I/O operations
- HTTP requests

### IContextMenu

The `IContextMenu` interface is used to add context menu buttons to the query results:

```cs
public interface IContextMenu
{
    List<ContextMenuResult> LoadContextMenus(Result selectedResult);
}
```

- Every `Result` can be enhanced with custom buttons

### ISettingProvider

If the plugin is sophisticated enough to have custom settings, implement the `ISettingProvider` interface:

```cs
public interface ISettingProvider
{
    Control CreateSettingPanel();

    void UpdateSettings(PowerLauncherPluginSettings settings);

    IEnumerable<PluginAdditionalOption> AdditionalOptions { get; }
}
```

- `CreateSettingPanel` usually throw a `NotImplementedException`
- `UpdateSettings` is invoked when the user updates the settings in the PowerToys GUI
  - Use this method to save the custom settings and update the state of the plugin
- `AdditionalOptions` is invoked when the PowerToys GUI displays the settings
  - Use this property to define how the custom settings are renderer in the PowerToys GUI

## Classes

Some classes of interest from the `Wox.Plugin` assembly:

- `PluginInitContext`
- `Query`
- `Result`
- `ContextMenuResult`

### PluginInitContext

A `PluginInitContext` instance is passed as argument to the `Init` method:

```cs
public class PluginInitContext
{
    public PluginMetadata CurrentPluginMetadata { get; internal set; }

    public IPublicAPI API { get; set; }
}
```

- `PluginMetadata` can be useful if you need the path to the `PluginDirectory` or the `ActionKeyword` of the plugin
- `IPublicAPI` is mainly used to `GetCurrentTheme`, but can also `ShowMsg`, `ShowNotification` or `ChangeQuery`

### Query

A `Query` instance is passed to the `Query` methods defined in the `IPlugin` and `IDelayedExecutionPlugin` interfaces.

Properties of interest:

- `Search` returns what the user has searched for, excluding the action keyword.
- `Terms` returns the search as a collection of substrings, split by space (`" "`)

### Result

A list of `Result` objects are returned by the `Query` methods defined in the `IPlugin` and `IDelayedExecutionPlugin` interfaces.

Example of how to create a new result:

```cs
new Result
{
    QueryTextDisplay = query.Search, // displayed where the user types queries
    IcoPath = IconPath, // displayed on the left side
    Title = "A title displayed in the top of the result",
    SubTitle = "A subtitle displayed under the main title",
    ToolTipData = new ToolTipData("A tooltip title", "A tooltip text\nthat can have\nmultiple lines"),
    Action = _ =>
    {
        Log.Debug("The actual action of the result when pressing Enter.", GetType());
        /*
        For example:
        - Copy something to the clipboard
        - Open a URL in a browser
        */
    },
    Score = 1, // the higher, the better query match
    ContextData = someObject, // used together with the IContextMenu interface
}
```

### ContextMenuResult

A list of `ContextMenuResult` objects are returned by the `LoadContextMenus` method defined in the `IContextMenu` interface.
These objects are rendered as small buttons, displayed on the right side of the query result.

Example of how to create a new context menu result:

```cs
new ContextMenuResult
{
    PluginName = Name,
    Title = "A title displayed as a tooltip",
    FontFamily = "Segoe Fluent Icons,Segoe MDL2 Assets",
    Glyph = "\xE8C8", // Copy
    AcceleratorKey = Key.C,
    AcceleratorModifiers = ModifierKeys.Control,
    Action = _ =>
    {
        Log.Debug("The actual action of the context menu result, when clicking the button or pressing the keyboard shortcut.", GetType());
        /*
        For example:
        - Copy something to the clipboard
        - Open a URL in a browser
        */
    },
}
```

Find the perfect `Glyph` to use from:

- [Segoe Fluent Icons font](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-fluent-icons-font)
- [Segoe MDL2 Assets icons](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-ui-symbol-font)

## Actions

Examples of actions to use with `Result` or `ContextMenuResult`:

```cs
Action = _ =>
{
    System.Windows.Clipboard.SetText("Some text to copy to the clipboard");
    return true;
}
```

```cs
Action = _ =>
{
    var url = "https://conductofcode.io/";

    if (!Helper.OpenCommandInShell(DefaultBrowserInfo.Path, DefaultBrowserInfo.ArgumentsPattern, url))
    {
        Log.Error("Open default browser failed.", GetType());
        Context?.API.ShowMsg($"Plugin: {Name}", "Open default browser failed.");
        return false;
    }

    return true;
}
```

## Logging

Logging is done with the static `Log` class, from the `Wox.Plugin.Logger` namespace.
Under the hood, `NLog` is used.

Five log levels:

```cs
Log.Debug("A debug message", GetType());
Log.Info("An information message", GetType());
Log.Warn("A warning message", GetType());
Log.Error("An error message", GetType());
Log.Exception("An exceptional message", new Exception(), GetType());
```

The logs are written to `.txt` files, rolled by date, at:

- `%LocalAppData%\Microsoft\PowerToys\PowerToys Run\Logs\<Version>\`

## Dependencies

If you have the need to add third party dependencies, take a look at what is already used by PowerToys.

- [Directory.Packages.props](https://github.com/microsoft/PowerToys/blob/main/Directory.Packages.props)

NuGet packages and the versions specified in the `.props` file are candidates to reference in your own `.csproj` file.

Packages of interest:

- `LazyCache`
- `Newtonsoft.Json`

If the plugin uses any third party dependencies that are not referenced by PowerToys Run, you need to enable `DynamicLoading`.

In the `plugin.json` file:

```json
{
    // ...
    "DynamicLoading": true
}
```

- `true` makes PowerToys Run dynamically load any `.dll` files in the plugin folder

## Tests

You can write unit tests for your plugin.
The official plugins use the [MSTest](https://github.com/microsoft/testfx) framework and `Moq` for mocking.

- Project name: `Community.PowerToys.Run.Plugin.<PluginName>.UnitTests`
- Target framework: `net8.0-windows`

The `.csproj` file of a unit test project may look something like this:

{% gist hlaueriksson/5484a19def85f618d7a2297628486c80 Community.PowerToys.Run.Plugin.Demo.UnitTests.csproj %}

- Apart from the actual test assemblies, some package references are also needed
- As well as references to PowerToys and Wox `.dll` assemblies

Unit tests of the `Main` class may look something like this:

{% gist hlaueriksson/5484a19def85f618d7a2297628486c80 MainTests.cs %}

Some of the official plugins have unit test coverage:

- <https://github.com/microsoft/PowerToys/tree/main/src/modules/launcher/Plugins>

## Distribution

Unfortunately, the plugin manager in PowerToys Run does not offer support for downloading new plugins.

Community plugins are traditionally packaged in `.zip` files and distributed via releases in GitHub repositories.

The process is described in a unofficial checklist:

- [Community plugin checklist](https://github.com/hlaueriksson/awesome-powertoys-run-plugins/blob/main/checklist.md)

The `Everything` plugin by Lin Yu-Chieh (Victor) is next level and is [distributed](https://github.com/lin-ycv/EverythingPowerToys/releases) via:

- Self-Extraction Installer (EXE)
- Manual Installation (ZIP)
- WinGet
- Chocolatey

## Resources

Demo Plugin:

- <https://github.com/hlaueriksson/ConductOfCode/tree/master/PowerToysRun>

Awesome PowerToys Run Plugins:

- <https://github.com/hlaueriksson/awesome-powertoys-run-plugins>

Third-Party plugins for PowerToy Run:

- <https://github.com/microsoft/PowerToys/blob/main/doc/thirdPartyRunPlugins.md>

Unofficial Visual Studio project template for PowerToys Run plugins:

- <https://github.com/8LWXpg/PowerToysRun-PluginTemplate>

Documentation:

- <https://learn.microsoft.com/en-us/windows/powertoys/run>

Dev Documentation:

- <https://github.com/microsoft/PowerToys/tree/main/doc/devdocs/modules/launcher>

If you want to look under the hood, fork or clone the PowerToys repo:

- <https://github.com/microsoft/PowerToys>

Get the solution to build on your machine with the help of the documentation:

- [Compiling PowerToys](https://github.com/microsoft/PowerToys/tree/main/doc/devdocs#compiling-powertoys)
