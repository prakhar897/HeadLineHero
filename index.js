var express = require("express");
var	app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var User = require('./models/user');
var bcrypt = require('bcrypt');
var expressSession = require('express-session');
var passport = require('passport');



dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized:false 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

require('./config/passport')(passport); // pass passport for configuration


var url = process.env.DATABASEURL;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Match the raw body to content type application/json
app.post('/pay-success', bodyParser.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase...
        console.log(session);
        User.findOne({
            email: session.customer_email
        }, function(err, user) {
            if (user) {
                user.subscriptionActive = true;
                user.subscriptionId = session.subscription;
                user.customerId = session.customer;
                user.save();
            }
        });
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
});


app.post('/cancel-sub' , (req,res)=>{
    User.findOne({
        _id:req.session.passport.user
    })
    .then((user) => {
        stripe.subscriptions.del(user.subscriptionId, (err,confirmation) => {
            if(err)
                console.log(err);
            else
                user.subscriptionActive = false;
                user.subscriptionId = null;
                user.customerId = null;
                user.save();
                res.redirect('/billing');
        });
    });
    
});

app.use('/', require('./routes/api'));
app.use('/', require('./routes/billing'));
require('./routes/auth.js')(app, passport);

app.listen(process.env.PORT,function(req,res){
	console.log(`Listening on port ${process.env.PORT}`);
});