---
layout: post
title: Getting started with Angular 2
date: 2016-09-30 10:00:00
update: 2016-10-05 14:00:00
tags:
 - Angular 2
 - TypeScript
image:
 path: visual-studio-code.png
 width: 2880
 height: 1800
---

I needed to update my resume, maintenance was long overdue. I decided to make an Angular 2 app and put it on my portfolio site.

Take a look at the result: [http://henrik.laueriksson.com/cv/](http://henrik.laueriksson.com/cv/)

Take a look at the code: [https://github.com/hlaueriksson/cv](https://github.com/hlaueriksson/cv) 

N.B. The CV is in Swedish.

## Angular 2

Angular 2.0.0 was [released two weeks ago](http://angularjs.blogspot.com/2016/09/angular2-final.html).

Read the docs at: [https://angular.io](https://angular.io)

To get started you need to install:

* Node.js
* npm

I'm writing this on a Mac, so installing the prerequisites was easy.

(On a side note, installing Jekyll on Mac OS X was also way easier than on [Windows]({% post_url 2016-01-16-setting-up-jekyll-on-windows %}))

Angular 2 apps consists of:

* TypeScript
    * You can also use JavaScript or Dart
* HTML
* CSS

I'm using [Visual Studio Code](https://code.visualstudio.com) as my editor. It does a good job with TypeScript, HTML and CSS.

## Angular-CLI

To make Angular 2 development less painful, use the Angular-CLI tool.

Read the docs at: [https://github.com/angular/angular-cli](https://github.com/angular/angular-cli)

With Angular-CLI you don't need a build script or a task manager. No need for Gulp or Grunt anymore!

Here follows the account of what I did to write my CV app...

Generate a new project with `ng new cv`:

![ng new cv](angular-cli-new.png)

This will:

* create all files needed to get started
* initialize git
* install npm packages

Check out the automated commit with `git log`:

![git log](angular-cli-git-log.png)

Run a development server with `ng serve`:

![ng serve](angular-cli-serve.png)

Then you can browse `http://localhost:4200/`

Run unit tests with `ng test`:

![ng test](angular-cli-test.png)

Run end-to-end tests with `ng e2e`:

![ng e2e](angular-cli-e2e.png)

Generating code:

* `ng g component foo`
* `ng g service foo`
* `ng g class foo`

I generated three components, one service and one class.

Read more about scaffolding in the [angular-cli README](https://github.com/angular/angular-cli/blob/master/README.md#generating-components-directives-pipes-and-services).

After the scaffolding, the actual coding began...

Random thoughts:

* The TypeScript syntax take some time to get used to. I like that it's type safe. C# developers should feel more at home with TypeScript than with JavaScript.
* The development server runs with a file watch. Just save the file you are working on in the editor. The code is then transpiled and bundled. The browser reloads automatically. This is awesome!
* Specs end up in the same folder as the production code. It makes it easy to navigate the editor. 
* Components can have their own CSS files. This makes styling very modular.
* Refactoring support in Visual Studio Code is lacking.
* Googling on errors will lead you to Stack Overflow, but the answers may be for a beta or release candidate of Angular 2. Then you are out of luck.

Run tslint with `ng lint`:

![ng lint](angular-cli-lint.png)

And then fix your mistakes :)

I build my prod dist with `ng build --prod --bh /cv/`

> All builds make use of bundling

The `--prod` flag

> will also make use of uglifying and tree-shaking functionality.

I need to set the `--bh` flag to update the `base href`, because I'll host the app in a subfolder on [http://henrik.laueriksson.com/cv/](http://henrik.laueriksson.com/cv/)

A really cool feature is [direct deployment to GitHub Pages](https://github.com/angular/angular-cli/blob/master/README.md#deploying-the-app-via-github-pages). I didn't try this, maybe next time.

## Conclusion

Try Angular 2! You will learn something new if you are a backend developer like me.
