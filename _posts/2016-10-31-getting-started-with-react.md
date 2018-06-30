---
layout: post
title: Getting started with React
date: 2016-10-31 13:00:00
tags:
 - React
 - JavaScript
image:
 path: visual-studio-code.png
 width: 2880
 height: 1800
---

I wanted to write another Single Page Application, this time in React. I made an app that displays my latest online activities and put it on my portfolio site.

Take a look at the result: [http://henrik.laueriksson.com/latest/](http://henrik.laueriksson.com/latest/)

Take a look at the code: [https://github.com/hlaueriksson/latest](https://github.com/hlaueriksson/latest)

You can also compare this with the previous post on [Angular 2]({% post_url 2016-09-30-getting-started-with-angular-2 %}).

## React

React was released more than 3 years ago and has proven to be quite [popular](https://github.com/facebook/react/wiki/Sites-Using-React).

Read the docs at: [https://facebook.github.io/react/](https://facebook.github.io/react/)

React apps consists of:

* JavaScript
    * (You can also use TypeScript)
* JSX
* CSS

I'm still using [Visual Studio Code](https://code.visualstudio.com) as my editor. It does a good job with JavaScript, JSX and CSS.

Visual Studio Code Extensions:

* [Reactjs code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)
* [jsx](https://marketplace.visualstudio.com/items?itemName=TwentyChung.jsx)

## Create React App

To make React development less painful, use the Create React App tool.

Read the docs at: [https://github.com/facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)

To get started you need to install:

* Node.js
* npm

With Create React App you don’t need a build script or a task manager. No need for Gulp or Grunt anymore!

Here follows the account of what I did to write my "Latest" app...

Generate a new project with `create-react-app latest`:

![create-react-app latest](create-react-app-0.png)
![create-react-app latest](create-react-app-1.png)
![create-react-app latest](create-react-app-2.png)

This will:

* create all files needed to get started
* install npm packages
    * `react-scripts` is a development dependency

Run a development server with `npm start`:

![npm start](npm-start.png)

Then you can browse `http://localhost:3000/`

I'm using [Chrome](https://www.google.com/chrome) as my browser. It does a good job with inspecting HTML and debugging JavaScript.

![React Developer Tools](react-devtools.png)

Chrome Extensions:

* [React Developer Tools](https://github.com/facebook/react-devtools)

Run unit tests with `npm test`:

![npm test](npm-test.png)

After generating the project, the actual coding began...

The app displays my latest activities on:

* My blog
* Twitter
* GitHub
* Instagram

The Instagram API does not support CORS, so I could not access it directly from the React scripts. I ended up creating my own API as a proxy. It's a ASP.NET Core Web API based on [CommandQuery]({% post_url 2016-08-31-introducing-commandquery %}). 

The API provides convenient queries for the React app to get my latest:

* Blog post
* GitHub repo and commit
* Instagram photo

Take a look at the code: [https://github.com/hlaueriksson/latest-api](https://github.com/hlaueriksson/latest-api)

The API is hosted on Azure: [http://hlaueriksson-latest-api.azurewebsites.net/api/query/](http://hlaueriksson-latest-api.azurewebsites.net/api/query/)

Random thoughts:

* The JavaScript syntax is not that bad.
* The development server runs with a file watch. Just save the file you are working on in the editor. The code is then compiled and bundled. The browser reloads automatically. This is awesome!
* Tests end up in the same folder as the production code. It makes it easy to navigate the editor. 
* Components can have their own CSS files. This makes styling very modular.
* After reading [How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.vq745pjp5), I actually understood more of what I was doing (I'm not a frontend dev).

Build a prod dist with `npm run build`:

![npm run build](npm-run-build.png)

I needed to specify the `homepage` in `package.json`, because I'll host the app in a subfolder on [http://henrik.laueriksson.com/latest/](http://henrik.laueriksson.com/latest/)

A really cool feature is [direct deployment to GitHub Pages](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages). I didn't try this, maybe next time.

## React vs Angular

React feels more lightweight than Angular. It does one thing really good. For the stuff that it does not do, use other libraries.

The Create React App tools is very similar to Angular-CLI. Actually it's the other way around, Create React App is older.

Create React App does not provide:

* Code generation
* Dedicated end-to-end test script
* Dedicated lint script
* Git chore

Well, that does not really matter for me. The code was pretty easy to write by hand. There is also extensions for Visual Studio Code for that.

I like React more than Angular and I will probably use it again in the future.

## Conclusion

Try React! You will learn something new if you are a backend developer like me.
