const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  
    passport.use('local',new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function(email, password, next) {
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) return console.log(err);
            if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
                return next('Email or password incorrect');
            }
            next(null, user);
        });
    }));

    passport.use('signup-local',new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function(email, password, next) {
        User.findOne({
            email:email
        },function(err,user){
            if(err) return next(err);
            if(user) return next("User already exists");
            let newUser = new User({
                email: email,
                passwordHash: bcrypt.hashSync(password,10)
            });
            newUser.save(function(err){
                next(err,newUser);
            });
        });
    }));

    passport.serializeUser(function(user,next){
        next(null,user._id); 
    });

    passport.deserializeUser(function(id,next){
        User.findById(id,function(err,user){
            next(err,user);
        });
    });
};