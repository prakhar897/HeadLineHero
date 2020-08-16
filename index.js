var express = require("express");
var	app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var User = require('./models/user');
var bcrypt = require('bcrypt');
var expressSession = require('express-session');
var passport = require('passport');
const flash = require('connect-flash');



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

app.use(flash()); 

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});


require('./config/passport')(passport); // pass passport for configuration


var url = process.env.DATABASEURL;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use('/', require('./routes/api'));
app.use('/', require('./routes/billing'));
require('./routes/auth.js')(app, passport);


app.get('*', function(req, res){
  res.render('404');
});


app.listen(process.env.PORT,function(req,res){
	console.log(`Listening on port ${process.env.PORT}`);
});