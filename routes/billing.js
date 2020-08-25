var router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var middlewares = require("../middlewares");
var bodyParser = require("body-parser");

const User = require("../models/user");

router.get("/billing", middlewares.isLoggedIn, async function (req, res, next) {

  const session_monthly = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    payment_method_types: ["card"],
    subscription_data: {
      items: [
        {
          plan: process.env.STRIPE_PRICE_MONTHLY,
        },
      ],
    },
    success_url:process.env.BASE_URL + "billing?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.BASE_URL + "",
  });

  const session_yearly = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    payment_method_types: ["card"],
    subscription_data: {
      items: [
        {
          plan: process.env.STRIPE_PRICE_YEARLY,
        },
      ],
    },
    success_url:process.env.BASE_URL + "billing?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.BASE_URL,
  });

  const session_ltd = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    payment_method_types: ["card"],
    line_items: [{
        price_data: {
        currency: 'usd',
        product_data: {
            name: 'LifeTime Deal',
        },
        unit_amount: 12900,
    },
    quantity: 1,
    }],
    mode: "payment",
    success_url:process.env.BASE_URL + "billing?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.BASE_URL,
  });

  res.render("billing", {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    sessionId_monthly: session_monthly.id,
    sessionId_yearly: session_yearly.id,
    sessionId_ltd: session_ltd.id,
	  sub_monthly_active: req.user.sub_monthly.active,
	  sub_yearly_active: req.user.sub_yearly.active,
	  sub_ltd_active: req.user.sub_lifetime.active,
  });
});

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.ENDPOINT_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      User.findOne(
        {
          email: session.customer_email,
        },
        function (err, user) {
          if (user) {
            if (session.amount_total == 900) {
              user.sub_monthly.active = true;
              user.sub_monthly.subscriptionId = session.subscription;
              user.sub_monthly.customerId = session.customer;
            }

            if (session.amount_total == 8900) {
              user.sub_yearly.active = true;
              user.sub_yearly.subscriptionId = session.subscription;
              user.sub_yearly.customerId = session.customer;
            }

            if (session.amount_total == 12900) {
              user.sub_lifetime.active = true;
              user.sub_lifetime.subscriptionId = session.subscription;
              user.sub_lifetime.customerId = session.customer;
            }

            user.save();
          }
        }
      );
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

router.post('/cancel-sub-monthly' , (req,res)=>{
    User.findOne({
        _id:req.session.passport.user
    })
    .then((user) => {
        stripe.subscriptions.del(user.sub_monthly.subscriptionId, (err,confirmation) => {
            if(err)
                console.log(err);
            else {
                user.sub_monthly.active = false;
                user.sub_monthly.subscriptionId = null;
                user.sub_monthly.customerId = null;
                user.save();
                res.redirect('/billing');
			}
        });
    });   
});

router.post('/cancel-sub-yearly' , (req,res)=>{
    User.findOne({
        _id:req.session.passport.user
    })
    .then((user) => {
        stripe.subscriptions.del(user.sub_yearly.subscriptionId, (err,confirmation) => {
            if(err)
                console.log(err);
            else {
                user.sub_yearly.active = false;
                user.sub_yearly.subscriptionId = null;
                user.sub_yearly.customerId = null;
                user.save();
                res.redirect('/billing');
			}
        });
    });   
});

module.exports = router;
