# ngServerMessages

Intercept a specific http request, show a loading message and a specific http status messages.

## Demo

Codepen demo [here]()

## Install

Download the package with Bower:
```bower install --save ngServerMessages```

In your index.js:

```
angular.module('MyApp', ['ngServerMessages']);
```

## Using

In your DOM:

```
<div ng-server-messages="myRequest">
	<div ng-server-message-loading class="alert">
		<i class="fa fa-refresh fa-spin"></i> Loading...
	</div>
	<div ng-server-message="200" class="alert alert-success">
		<i class="fa fa-check"></i> Yeah :D
	</div>
	<div ng-server-message="419" class="alert alert-success">
		<i class="fa fa-times"></i> Hooo :(
	</div>
</div>
```

- **ng-server-messages** is used to target the your request (via specific header setup in the next step)
- **ng-server-message-loading** define the tag that will be shown during the loading process
- **ng-server-message** allows you to specify a specific content based on the returned http status code.
- **ng-server-message-default** is the default message when the query isn't fired yet (helpful for dynamic status buttons).

In your service:
You need now to identify the service ou want to target with **ng-server-messages** directive.
For that we will use a custom header named : **X-ng-service-name**;

With $http:

```
$http({
	method: 'GET',
	url: 'http://myurl.io/myendpoint',
	headers: {
		'X-ng-service-name': 'myRequest'
	}
});
```

With $resource:

```
$resource('http://myurl.io/myendpoint', { 
		myQueryParam: 'banana'
	}, {
		'get': {
			method: 'GET',
			headers: {
				'X-ng-service-name': 'notesbadrequest'
			}
		}
	});
```