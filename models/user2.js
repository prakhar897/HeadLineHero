var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    email: {type: String, require: true, index:true, unique:true},
    passwordHash: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User2", userSchema);