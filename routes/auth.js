module.exports = function(app, passport) {
    app.get('/signup',function(req,res,next){
        res.render('signup',{message: req.flash('signupMessage')});
    });

    app.post('/signup',
        passport.authenticate('signup-local', {
            successRedirect: '/form', 
            failureFlash : true,
            failureRedirect: '/signup' 
        })
    );



    app.get('/login',function(req,res,next){
        res.render('login',{message: req.flash('loginMessage')});
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/billing', 
            failureFlash : true,
            failureRedirect: '/login',
        })
    );

    app.get('/logout',function(req,res,next){
        req.logout();
        res.redirect('/');
    });
}