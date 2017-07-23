# NodeDrawing
A Multiplayer Real-Time drawing, using materializecss and angularJS in front-end and NodeJS in back-end.

## Installation of Application

* Install Node.js from [nodejs.org](https://nodejs.org/en/download/)

* Open you terminal and navigate into application directory

* Create package.json

```json
//example
{
	"name": "nodedrawing",
	"version": "0.1.0",
	"author": "IvoFacundo"
}
```

* Install the unique two dependencies (for now)

```shell
$ npm install express --save
```

```shell
$ npm install socket.io --save
```

## Frameworks in front-end

* JQuery from [jquery.org](https://code.jquery.com/), version in project 3.2.1
* AngularJS from [angularjs.org](https://angularjs.org/), version in project 1.6.4
* Angular dependencies ngRoute and ngResource and ui.materialize (MaterializeCSS to angularJS)
  * Angular-materialize see the source code here [https://krescruz.github.io/angular-materialize](https://krescruz.github.io/angular-materialize)
  * ngRoutse and ngResource getist from offical directory of angularJS [https://code.angularjs.org/1.6.4/](https://code.angularjs.org/1.6.4/) 
* Materializecss framework [http://materializecss.com](materializecss.com)

## Client(HTML)
* Create a file in project directory public/index.html
* Adding all the scripts and frameworks in the file.

```html
<!DOCTYPE html>
<html ng-app='DrawApp'> 
  <head>
      <meta charset='utf-8' />
      <title>Drawing real-time using NodeJS and Sockets</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/css/materialize.min.css'>
      <link rel="stylesheet" href="css/app.css">
      <script src='/socket.io/socket.io.js'></script>
			<script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
      <script src="https://code.angularjs.org/1.6.4/angular-route.min.js"></script>
      <script src="https://code.angularjs.org/1.6.4/angular-resource.min.js"></script>
      <script src='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js'></script>
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-materialize/0.2.2/angular-materialize.min.js"></script> 
  </head>

  <body>
    <main ng-view></main>
 
  </body>
</html>
```

* Directives in index.html
	* ng-app = We initialize this to tell the HTML that it is an application of AngularJS
	* ng-view = This directive is used to change the content depending on the URL of the application (using ngRoutes)
	
* Create public/js/app.js
	* Setting up AngularJS 
```javascript
var app = angular.module('DrawApp',['ui.materialize','ngRoute','ngResource']);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            controller : 'MainController',
            templateUrl : 'templates/home.html'
        })
        .when('/draw',{
            controller : 'DrawController',
            templateUrl : 'templates/draw.html'
        })
});
```


* Create public/js/controllers.js

	* Setting up controllers to app
```javascript
var app = angular.module("DrawApp");

app.controller('MainController', ['$scope','$resource','$routeParams', function($scope,$resource,$routeParams){
	//anything for now
}]);

app.controller('DrawController', ['$scope','$resource','$routeParams', function($scope,$resource,$routeParams){
	$scope.title = 'Draw Real Time';
}]);
```

## Font-Awesome 
* I only use that library only for some icons, you can get it here [http://fontawesome.io/](http://fontawesome.io/)

## Server NodeJS

* Create file server.js

```javascript
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
```

* Specify a public path to assets
```javascript
app.use(express.static('public')); // public is the name of folder in the app
```

* setting up port
```javascript
var port = 3000;
http.listen(port, function() {
	console.log('Server running on port ' + port);
});
```

* Run the server
```shell
$ node server.js
```

* You can see the app running at port [localhost:3101](http://localhost:3101)





