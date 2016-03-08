var User = require('../models/user');
var config = require('../../cfg'); //we need the secure key from the cfg file in root
var secureKey = config.secureKey;
var jsonwebtoken = require('jsonwebtoken');

    // Code for generating a token using the securekey and some of the fields
function getToken(user){
    var generatedToken = jsonwebtoken.sign({
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        isAdmin: user.isAdmin
    }, secureKey, {
        expiresinMinute: 1440
    });
    return generatedToken;
}

module.exports = function(app, express) {
    var serverApi = express.Router();

    // Code for creating a new user
    serverApi.post('/signup', function(req, res){
        var user = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        });
        var token = getToken(user); // this is done so it will login automatically after signup
        user.save(function(err){
            if(err){
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User created!',
                token:token
            });
        });
    });

    // Code for displaying users
    serverApi.get('/users', function(req, res){
        User.find({}, function(err, users){
            if(err){
                res.send(err);
                return;
            }
            res.json(users);
        });
    });

    // Code for deleting users
    serverApi.delete('/deleteUser', function(req, res){
        User.findOne({
            email: req.query.email
        }).select('password').exec(function(err, user){
            if(err) throw err;
            else {
                //console.log("EMAIL: "+ req.body.email); // returns email: undefined
                user.remove(function (err) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    res.json({message: 'User deleted!'});
                });
            };
        });
    });

    // Code for logging in.
    serverApi.post('/home', function(req, res){

        User.findOne({
            email: req.body.email
        }).select('email fname lname password isAdmin').exec(function(err, user){
            if(err) throw err;
            if(!user) {
                res.send({ message: "Email not registered"});
            } else if(user){
                var correctPassword = user.checkPassword(req.body.password);
                if(!correctPassword){
                    res.send({ message: "Incorrect password"});
                } else {
                    var token = getToken(user); //generating a token
                    res.json({
                        success: true,
                        message: "Logged in successfully.",
                        token: token
                    });

                }
            }
        });
    });

    // Code for updating users.
    serverApi.put('/updateUser', function(req, res){
        User.findOne({
            email: req.body.email
        }).select('password').exec(function(err, user){
            if(err) throw err;
            else {
                user.fname = req.body.fname;
                user.lname = req.body.lname;
                user.password = req.body.password;
                var token = getToken(user);
                user.save(function (err){
                    if (err){
                        res.send(err);
                        return;
                    }
                    res.json({
                        message: 'User Updated!',
                        token:token
                    })
                })
            }
        })
    })


    // Code for giving user admin rights.
    serverApi.put('/makeAdmin', function(req, res){
        User.findOne({
            email: req.body.email
        }).select('password').exec(function(err, user){
            if(err) throw err;
            else {
                user.isAdmin = req.body.isAdmin;
                user.save(function (err){
                    if (err){
                        res.send(err);
                        return;
                    }
                    res.json({
                        message: 'User Updated!',
                    })
                })
            }
        })
    })

    // Code if the token is valid. this is the middleware, what is after this requires token.
    serverApi.use(function(req, res, next){
        console.log("Someone logged in");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        // Check if token exists.
        if(token) {
            jsonwebtoken.verify(token, secureKey, function(err, decoded){
                if(err){
                    res.status(403).send({ success: false, message: "Failed to authenticate user"});
                } else {
                    //
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({ success: false, message: "No token found"});
        }
    });

    // Get information about logged user out of the token.
    serverApi.get('/me', function(req, res){
        res.json(req.decoded);
    });


    return serverApi;


};