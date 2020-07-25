var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    email: String,
    passwordHash: String,
    sub_monthly: {
        active: { type: Boolean, default: false },
        customerId: String,
        subscriptionId: String
    },
    sub_yearly: {
        active: { type: Boolean, default: false },
        customerId: String,
        subscriptionId: String
    },
    sub_lifetime: {
        active: { type: Boolean, default: false },
        customerId: String,
        subscriptionId: String
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);