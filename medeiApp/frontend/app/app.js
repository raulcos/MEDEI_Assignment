angular.module('MedeiApp', ['appRoutes', 'loginCtrl', 'loginService', 'userCtrl', 'userService'])

.config(function($httpProvider){

    $httpProvider.interceptors.push('TheInterceptor');

});