var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Bcrypt has inbuilt hash method and another method for comparing passwords, so let's use it.
var bcrypt = require('bcrypt-nodejs');

// Defining how user should look like.
var UserSchema = new Schema({
    fname: { type:String, required: true},
    lname: { type:String, required: true},
    email: { type: String, required: true, index: {unique: true}},
    password: { type:String, required: true, select: false},
    isAdmin: Boolean
});

// Hashing the password..
UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

// A method to compare the password when logging in.
UserSchema.methods.checkPassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);