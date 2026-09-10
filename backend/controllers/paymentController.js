
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../config/config.env') })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log("stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "yes" : "no");

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        description: 'Order payment for shopit purchase',
        shipping: {
            name: req.body.shippingInfo.name || req.user.name,
            address: {
                line1: req.body.shippingInfo.address,
                city: req.body.shippingInfo.city,
                postal_code: req.body.shippingInfo.postalCode,
                state: req.body.shippingInfo.state,
                country: req.body.shippingInfo.country // must be 2-letter ISO code e.g. 'US'
            },
        },
        metadata: { integration_check: 'accept_a_payment' }
    });

    console.log("paymentIntent-----", paymentIntent);

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

})

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})