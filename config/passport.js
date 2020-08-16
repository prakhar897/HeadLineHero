const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/user');
const User2 = require('../models/user2');

module.exports = function(passport) {
  
    passport.use('local',new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true 
    }, function(req,email, password, next) {
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) return next({'message':err});
            if(!user) return next(null, false, req.flash('loginMessage', 'No user found.'));
            if (!bcrypt.compareSync(password, user.passwordHash)) {
                return next(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            next(null, user);
        });
    }));

    passport.use('signup-local',new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true 
    }, function(req,email, password, next) {
        User.findOne({
            email:email
        },function(err,user){
            if(err) return next(err);
            if(user) return next(null, false, req.flash('signupMessage', 'User already exists'));

            let newUser2 = new User2({
                email:email,
                passwordHash: password
            });
            
            newUser2.save(function(err){
                next(err,newUser2);
            });

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