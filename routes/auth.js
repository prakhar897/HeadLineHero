module.exports = function(app, passport) {
    app.get('/signup',function(req,res,next){
        res.render('signup');
    });

    app.post('/signup',
        passport.authenticate('signup-local', {
            successRedirect: '/form', 
            failureRedirect: '/signup' 
        })
    );



    app.get('/login',function(req,res,next){
        res.render('login');
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/billing', 
            failureRedirect: '/login' 
        })
    );

    app.get('/logout',function(req,res,next){
        req.logout();
        res.redirect('/');
    });
}