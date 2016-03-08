angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .when('/home', {
            templateUrl: 'app/views/home.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })

        .when('/signup',{
            templateUrl: 'app/views/signup.html'
        })

        .when('/userSettings',{
            templateUrl: 'app/views/userSettings.html',
            controller: 'UserController',
            controllerAs: 'userCtrl'
        })

    $locationProvider.html5Mode(true);


})