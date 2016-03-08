angular.module('loginCtrl', [])

.controller('LoginController', function($rootScope, $location, Authentication){

    var userctrl = this;

    // Basically gets user data.
    userctrl.loggedIn = Authentication.isLogged();
    $rootScope.$on('$routeChangeStart', function(){
        userctrl.loggedIn = Authentication.isLogged();
        Authentication.getUser()
            .then(function(data){
                userctrl.user = data.data;
            });
    });

    // Code to login the user.
    userctrl.doLogin = function(){
        userctrl.processing = true;
        userctrl.error ='';
        Authentication.login(userctrl.loginData.email, userctrl.loginData.password)
            .success(function(data){
                userctrl.processing = false;
                Authentication.getUser()
                    .then(function(data){
                        userctrl.user = data.data;
                    });
                if(data.success)
                    $location.path('/userSettings'); //redirecting after login
                else
                    userctrl.error = data.message;
            });
    }

    // Logs out.
    userctrl.doLogout = function(){
        Authentication.logout();
        $location.path('/home');
    }
});