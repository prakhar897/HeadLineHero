var router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var middlewares = require("../middlewares");


router.get('/billing', middlewares.isLoggedIn, function(req, res, next) {

    stripe.checkout.sessions.create({
        customer_email: req.user.email,
        payment_method_types: ['card'],
        subscription_data: {
            items: [{
                plan: process.env.STRIPE_PRICE_MONTHLY
            }]

        },
        success_url: process.env.BASE_URL + '/billing?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.BASE_URL + "/"
    }, function(err, session_monthly) {

        stripe.checkout.sessions.create({
            customer_email: req.user.email,
            payment_method_types: ['card'],
            subscription_data: {
                items: [{
                    plan: process.env.STRIPE_PRICE_YEARLY
                }]

            },
            success_url: process.env.BASE_URL + '/billing?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.BASE_URL + "/"
        }, function(err, session_yearly) {
            res.render('billing', { STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY, sessionId_monthly: session_monthly.id, sessionId_yearly: session_yearly.id, subscriptionActive: req.user.subscriptionActive })
        });
    })
})

module.exports = router;