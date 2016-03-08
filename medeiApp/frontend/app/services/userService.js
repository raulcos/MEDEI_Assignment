angular.module('userService', [])

.factory('User',function($http){
    var userFactory = {};
    userFactory.create = function(userData){
        return $http.post('/serverapi/signup', userData);
    }

    userFactory.all = function(){
        return $http.get('/serverapi/users');
    }

    userFactory.me = function(){
        return $http.get('/serverapi/me');
    }

    userFactory.updateUser = function(userData){
        return $http.put('/serverapi/updateUser', userData);
    }

    userFactory.makeAdmin = function(userData){
        return $http.put('/serverapi/makeAdmin', userData);
    }


    userFactory.deleteUser = function(userData){
        return $http.delete('/serverApi/deleteUser', { params: {"email":userData.email}});
    }

    return userFactory;

})