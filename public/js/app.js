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
})