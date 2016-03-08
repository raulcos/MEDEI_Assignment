angular.module('userCtrl', ['userService'])

// Get all users controller.
    .controller('UserController', function(User, $location, $window){

        var userctrl = this;

        // Displays all users
        User.all()
            .success(function(data){
                userctrl.users = data;
            });

        // Displays current user.
        User.me()
            .success(function(data){
                userctrl.currentUser = data;
            });

       // Code for deleting an user.
        var deleteduser = this;
        deleteduser.DeleteThisUser = function(){
            deleteduser.message = '';
            deleteduser.userData ={
                email: userctrl.currentUser.email
            };
            User.deleteUser(deleteduser.userData)
                .then(function(response){
                    deleteduser.userData = {};
                    deleteduser.message = response.data.message;
                    $window.localStorage.setItem('token', '');
                    $location.path('/');
                })
        }

        // Code for updating an user.
        var updateduser = this;
        updateduser.updateCurrentUser = function(){
            updateduser.message = '';
            updateduser.userData = {
                email: userctrl.currentUser.email,
                fname: userctrl.userData.fname,
                lname: userctrl.userData.lname,
                password: userctrl.userData.password
            };
            if (!updateduser.userData.fname || !updateduser.userData.lname || updateduser.userData.fname.length <= 2 || updateduser.userData.lname.length <=2 ) {
                updateduser.error = "Name too short";
            }
            else if(updateduser.userData.fname.length > 20 || updateduser.userData.lname.length >20){
                updateduser.error = "Name too long";
            }
            else if(!updateduser.userData.password || updateduser.userData.password.length < 5){
                updateduser.error = "Password too short";
            }
            else{
                User.updateUser(updateduser.userData)
                    .then(function(response){
                        updateduser.userData = {};
                        updateduser.message = response.data.message;
                        $window.localStorage.setItem('token', '');
                        $location.path('/');
                    })
            }

        }

        // Code for giving users admin rights.
        var adminwannabe = this;
        adminwannabe.makeHimAdmin = function(email){
            adminwannabe.message = '';
            adminwannabe.userData = {
                email: email,
                isAdmin: true
            };
            User.makeAdmin(adminwannabe.userData)
                .then(function(response){
                    adminwannabe.userData = {};
                    adminwannabe.message = response.data.message;
                    $location.path('/userSettings');
                })
        }
    })

    // User creation controller.
    .controller('CreateUserCtrl', function(User, $location, $window) {

        var creationctrl = this;

        creationctrl.signupUser = function () {
            creationctrl.error = '';
            if (!creationctrl.userData.fname || !creationctrl.userData.lname || creationctrl.userData.fname.length <= 2 || creationctrl.userData.lname.length <=2 ) {
                creationctrl.error = "Name too short";
            }
            else if(creationctrl.userData.fname.length > 20 || creationctrl.userData.lname.length >20){
                creationctrl.error = "Name too long";
            }
            else if(!creationctrl.userData.password || creationctrl.userData.password.length < 5){
                creationctrl.error = "Password too short";
            }
            else{
                User.create(creationctrl.userData)
                    .success(function (data) {
                        creationctrl.processing = false;
                        creationctrl.user = data.data;
                        if (data.success){
                            $window.localStorage.setItem('token', data.token);
                            $location.path('/userSettings'); //redirecting after login
                        }
                        else
                            creationctrl.error = "Failed to create an user";
                });
            }
        }
    });