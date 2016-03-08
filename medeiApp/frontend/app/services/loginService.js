angular.module('loginService', [])

.factory('Authentication', function($http, $q, LoginToken){
    var loginFactory = {};

    // Code for login, sets token for the user.
    loginFactory.login=function(email, password){
        return $http.post('/serverApi/home', {
            email: email,
            password: password
        })
            .success(function(data){
                LoginToken.setToken(data.token);
                return data;
            })
    }

    // Code for logout, resets token.
    loginFactory.logout = function(){
        LoginToken.setToken();
    }

    // Code to check if user is logged or not / if token exists or not.
    loginFactory.isLogged = function(){
        if(LoginToken.getToken())
            return true;
            else
            return false;
    }

    // Code to get user info out of token.
    loginFactory.getUser = function(){

        if(LoginToken.getToken())
            return $http.get('/serverapi/me');
        else
            return $q.reject({ message: "User doesn't have a token"});
    }

    return loginFactory;
})

.factory('LoginToken', function($window){

    var tokenFactory = {};

    // Gets the token from the browser.
    tokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    }

    // This should remove not legitimate tokens
    tokenFactory.setToken = function(token){
        if(token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
    }
    return tokenFactory;
})


.factory('TheInterceptor', function($q, $location, LoginToken){

    // We need to pass the token to every request.
    var interceptorFactory = {};

    interceptorFactory.request = function(config){
        var token= LoginToken.getToken();

        if(token){
            config.headers['x-access-token'] = token;
        }
        return config;
    };

    // Redirecting to login page when error occurs.
    interceptorFactory.responseError= function(response){
        if(response.status == 403)
            $location.path('/');
        return $q.reject(response);
    }
    return interceptorFactory;
});






