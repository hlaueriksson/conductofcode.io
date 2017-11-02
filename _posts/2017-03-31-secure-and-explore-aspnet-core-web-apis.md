---
layout: post
title: Secure and explore ASP.NET Core Web APIs
date: 2017-03-31 21:00:00
update: 2017-11-02 20:00:00
tags:
 - JWT
 - Swagger
 - Postman
 - C#
image:
 path: vs.png
 width: 1920
 height: 1048
---

How to create a ASP.NET Core Web API, secure it with [JSON Web Tokens](https://jwt.io) and explore it with [Swagger UI](http://swagger.io/swagger-ui/) and [Postman](https://www.getpostman.com).

You can view the example code in this post at [https://github.com/hlaueriksson/ConductOfCode](https://github.com/hlaueriksson/ConductOfCode)

## ASP.NET Core Web API

I installed the new Visual Studio 2017 and created a new ASP.NET Core Web Application.

![New ASP.NET Core Web Application](vs-new-project.png)

Then I added these dependencies:

* Swagger with [Swashbuckle.AspNetCore](https://www.nuget.org/packages/Swashbuckle.AspNetCore/)
* JSON Web Tokens (JWT) with [Microsoft.AspNetCore.Authentication.JwtBearer](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer/)

The subject in this blog post is the `StackController`:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 StackController.cs %}

* The controller provides a REST interface for an in-memory stack. It's the same example code I have used in a [previous]({% post_url 2017-01-31-reuse-specflow-features-to-test-both-via-api-and-browser %}) blog post.

* The `[Authorize]` attribute specifies that the actions in the controller requires authorization. It will be handled with JSON Web Tokens. The configuration for this will be done in the `Startup` class.

* The actions are decorated with `SwaggerResponse` attributes. This makes Swashbuckle understand the types returned for different status codes.

The `appsettings.json` file has some custom configuration for the JWT authentication:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 appsettings.json %}

* In this example we will use three things when issuing tokens; `Audience`, `Issuer` and the `SigningKey`

* The values for `Audience` and `Issuer` can be an arbitrary string. They will be used as claims and the tokens that are issued will contain them. 

* The `SigningKey` is used when generating the hashed signature for the token. The key must be kept secret. You probably want to use the [Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets) to secure the key.

The `TokenOptions` class is the type safe representation of the configuration in the appsettings:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 TokenOptions.cs %}

* The `Type` defaults to `Bearer`, which is the schema used by JWT.

* The expiration of the tokens defaults to one hour.

The `TokenOptions` will be used in two places in the codebase. Therefor I extracted some convenience methods into `TokenOptionsExtensions`:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 TokenOptionsExtensions.cs %}

* `GetExpiration` returns a `DateTime` (UTC) indicating when the issued token should expire.

* `GetSigningCredentials` returns an object that will be used for generating the token signature. `HmacSha256` is the algorithm used.

* `GetSymmetricSecurityKey` returns an object that wraps the value of the `SigningKey` as a byte array.

> The `Startup` class configures the request pipeline that handles all requests made to the application.

Swagger, SwaggerUI and JwtBearerAuthentication is configured here:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 Startup.cs %}

ConfigureServices:

* The `AddOptions` method adds services required for using options.

* The `Configure<TokenOptions>` method registers a configuration instance which `TokenOptions` will bind against. The `TokenOptions` from `appsettings.json` will be accessible and available for dependency injection.

* The `AddSwaggerGen` method registers the Swagger generator.

Configure:

* The `UseSwagger` method exposes the generated Swagger as JSON endpoint. It will be available under the route `/swagger/v1/swagger.json`.

* The `UseSwaggerUI` method exposes Swagger UI, the auto-generated interactive documentation. It will be available under the route `/swagger`.

* The `InjectOnCompleteJavaScript` method injects JavaScript to invoke when the Swagger UI has successfully loaded. I will get back to this later.

* The `UseStaticFiles` method enables static file serving. The injected JavaScript for the Swagger UI is served from the `wwwroot` folder.

* The `UseJwtBearerAuthentication` method adds JWT bearer token middleware to the web application pipeline.
`Audience` and `Issuer` will be used to validate the tokens.
The `SigningKey` for token signatures is specified here.
The authorization to the `StackController` will now be handled with JWT.

Read more about Swashbuckle/Swagger here: [https://github.com/domaindrivendev/Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)

To issue tokens, let's introduce the `AuthenticationController`:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 AuthenticationController.cs %}

* An `IOptions<TokenOptions>` object is injected to the constructor. The configuration is used when tokens are issues.

* The `JwtSecurityToken` class is used to represent a JSON Web Token.

* The `JwtSecurityTokenHandler` class writes a JWT as a JSON Compact serialized format string.

* Actual authentication is out of the scope of this blog post. You may want to look at [IdentityServer4](http://docs.identityserver.io/en/release/).

* You probably want to require SSL/HTTPS for the API.

The response from the `Token` action looks like this:

{% highlight json %}
{% raw %}
{
  "token_type": "Bearer",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTA5ODkyNzUsImlzcyI6IkNvbmR1Y3RPZkNvZGUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwNDgwIn0.iSP0Go20rzg69yxERldCCl4MRpCfC1JwcJTstkcc_Ss",
  "expires_in": 3600
}
{% endraw %}
{% endhighlight %}

`Audience`, `Issuer` and `Expiration` are included in the JWT payload:

{% highlight json %}
{
  "exp": 1490989275,
  "iss": "ConductOfCode",
  "aud": "http://localhost:50480"
}
{% endhighlight %}

If you copy the value of the `access_token`, you can use [https://jwt.io](https://jwt.io) to view the decoded content of the JWT:

![jwt.io](jwt-io.png)

When accessing the `StackController`, a JWT should be sent in the HTTP Authorization header:

{% highlight txt %}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTA5ODkyNzUsImlzcyI6IkNvbmR1Y3RPZkNvZGUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwNDgwIn0.iSP0Go20rzg69yxERldCCl4MRpCfC1JwcJTstkcc_Ss
{% endhighlight %}

Read more about JWT here: [https://jwt.io/introduction/](https://jwt.io/introduction/)

The request and response classes:

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 Token.cs %}

## Swagger UI

We can explore the API and the `StackController` with Swagger UI.

The Swagger UI in this example is available at `http://localhost:50480/swagger/`

The Swagger specification file looks like this: [swagger.json](swagger.json)

Because the API is using JwtBearerAuthentication, we will now get a `401` `Unauthorized` if we don't provide the correct HTTP Authorization header.

To fix this we can inject some JavaScript to Swagger UI with Swashbuckle. I was reading [Customize Authentication Header in SwaggerUI using Swashbuckle](http://stevemichelotti.com/customize-authentication-header-in-swaggerui-using-swashbuckle/) by Steve Michelotti before I was able to do this myself.

There are two approaches and two scripts located in the `wwwroot` folder of the project:

![wwwroot](vs-wwwroot.png)

### authorization1.js

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 authorization1.js %}

1. JQuery is used to post to the `AuthenticationController` and get a valid JWT

2. When the response is returned, the `access_token` is added to the authorization header

3. The `StackController` actions should now return responses with status codes `200`

Inject the script to Swagger UI in `Startup.cs`:

{% highlight cs %}
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConductOfCode");
    c.InjectOnCompleteJavaScript("/swagger-ui/authorization1.js");
});
{% endhighlight %}

The result looks like this:

![authorization1.js](swagger-ui-authorization1.png)

* Enter a username and password, click the *Get token* button to set the authorization header

* The *Get token* button only needs to be clicked once per page load

### authorization2.js

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 authorization2.js %}

1. CryptoJS is used to generate a valid JWT

    * The JWT payload and the `SigningKey` must be known

2. The generated token is added to the authorization header

3. The `StackController` actions should now return responses with status codes `200`

Inject the scripts to Swagger UI in `Startup.cs`:

{% highlight cs %}
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConductOfCode");
    c.InjectOnCompleteJavaScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"); // https://cdnjs.com/libraries/crypto-js
    c.InjectOnCompleteJavaScript("/swagger-ui/authorization2.js");
});
{% endhighlight %}

* The `crypto-js` script is injected from a CDN.

The result looks like this:

![authorization2.js](swagger-ui-authorization2.png)

* Enter audience, issuer, and signing key. A token is generated and the authorization header is set every time the *Try it out!* button for an action is clicked.

## Postman

We can explore the API and the `StackController` with Postman.

Download:
[https://www.getpostman.com](https://www.getpostman.com)

Import the Swagger specification file:

![Import](postman-import.png)

Then the API is available in a collection:

![Collection](postman-collection.png)

Because the API is using JwtBearerAuthentication, we will now get a `401` `Unauthorized` if we don't provide the correct HTTP Authorization header.

There are two approaches to fix this.

### Tests

The `Token` action in the `AuthenticationController` issues tokens.

Add some JavaScript in the **Tests** tab:

![Tests](postman-tests.png)

{% highlight js %}
var data = JSON.parse(responseBody);
postman.setGlobalVariable("Authorization", data.token_type + " " + data.access_token);
{% endhighlight %}

* When the response is returned, the access_token is stored in the global variable `Authorization`

* The request to the `Token` action only needs to be sent once per token lifetime (one hour)

Add Authorization to all actions in the **Headers** tab:

![Headers](postman-headers.png)

{% highlight txt %}
{% raw %}
Authorization:{{Authorization}}
{% endraw %}
{% endhighlight %}

* The token is accessed via the global variable `{% raw %}{{Authorization}}{% endraw %}`

The `StackController` actions should now return responses with status codes `200`.

### Pre-request Script

We can add some JavaScript to Postman that generates a valid JWT.
I was reading [JWT Authentication in Postman](https://developer.dansksupermarked.dk/v1/api/guides/jwt-authentication-in-postman/) before I was able to do this myself.

{% gist hlaueriksson/0144c69bb6c78a8ecb8a8874a7aa1a29 authorization3.js %}

1. CryptoJS is used to generate a valid JWT

    * The JWT payload and the `SigningKey` must be known

2. The generated token is stored in the global variable `Authorization`

Add the content of the `authorization3.js` file to global variable `authorize`:

![Globals](postman-globals.png)

Create an environment and add variables:

![Environment](postman-environment.png)

* `Audience`: `http://localhost:50480`
* `Issuer`: `ConductOfCode`
* `SigningKey`: `cc4435685b40b2e9ddcb357fd79423b2d8e293b897d86f5336cb61c5fd31c9a3`

Add JavaScript to all actions in the **Pre-request Script** tab:

![Pre-request Script](postman-pre-request-script.png)

{% highlight js %}
eval(postman.getGlobalVariable('authorize'));
authorize();
{% endhighlight %}

* The JavaScript is accessed from the global variable `authorize` and evaluated.

* The function `authorize` is executed and the token is generated.

The `StackController` actions should now return responses with status codes `200`.

The collection can be exported:

![Export](postman-export.png)

* Perfect for version control

The export file looks like this: [ConductOfCode.postman_collection.json](ConductOfCode.postman_collection.json)

### Troubleshooting

If you are having problems with JavaScript in Postman,
read [Enabling Chrome Developer Tools inside Postman](http://blog.getpostman.com/2014/01/27/enabling-chrome-developer-tools-inside-postman/).
