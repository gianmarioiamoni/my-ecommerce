import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import Stripe from 'stripe';

import Order from '../models/Order.js';

const router = express.Router();

let stripe = null;


const createPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing");
        throw new Error("Missing PayPal credentials");
    }

    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    return client;
};


const getOrderDetails = async (orderId, paypalClient) => {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await paypalClient.execute(request);
    return response.result;
};

router.post('/', async (req, res) => {
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails } = req.body;

    console.log("shippingData", shippingData);
    console.log("paymentMethod", paymentMethod);
    console.log("cartItems", cartItems);
    console.log("totalAmount", totalAmount);
    console.log("paymentDetails", paymentDetails);

    if (paymentMethod === 'paypal') {
        
        const paypalClient = createPayPalClient();
        
        try {
            const orderDetails = await getOrderDetails(paymentDetails.id, paypalClient);

            if (orderDetails.status === 'COMPLETED') {
                const existingOrder = await Order.findOne({ paypalOrderId: paymentDetails.id });
                if (existingOrder) {
                    return res.status(200).json({ status: 'success' });
                }

                const newOrder = new Order({
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    paypalOrderId: paymentDetails.id || undefined,
                });

                await newOrder.save();

                return res.status(200).json({ status: 'success' });
            } else {
                const request = new paypal.orders.OrdersCaptureRequest(paymentDetails.id);
                request.requestBody({});
                const capture = await paypalClient.execute(request);

                if (capture.result.status === 'COMPLETED') {
                    const newOrder = new Order({
                        products: cartItems.map(item => ({
                            product: item._id,
                            quantity: item.quantity,
                        })),
                        totalAmount,
                        paypalOrderId: paymentDetails.id || undefined,
                    });

                    await newOrder.save();

                    res.status(200).json({ status: 'success' });
                } else {
                    res.status(400).json({ status: 'error' });
                }
            }
        } catch (error) {
            console.error("Error during PayPal order capture:", error);
            if (error.response && error.response.statusCode === 422) {
                const errorData = error.response.result;
                if (errorData.details && errorData.details[0].issue === 'ORDER_ALREADY_CAPTURED') {
                    return res.status(400).json({ error: 'Order already captured' });
                }
            }
            res.status(500).json({ error: 'An error occurred while capturing the order' });
        }
    } else if (paymentMethod === 'credit-card') {
        console.log(" *** PAYMENT METHOD: CREDIT CARD *** ");

        const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

        try {
            console.log("paymentDetails.id", paymentDetails.id);
            const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentDetails.id);

            console.log("paymentIntent.status", paymentIntent.status);

            if (paymentIntent.status === 'succeeded') {

                const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentDetails.id });
                console.log("existingOrder", existingOrder);
                if (existingOrder) {
                    return res.status(200).json({ status: 'success' });
                }

                // create new order parameters
                const newOrderParams = {
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    stripePaymentIntentId: paymentDetails.id || undefined,
                };
                console.log("newOrderParams", newOrderParams);
                // create new order
                const newOrder = new Order(newOrderParams);
                console.log("newOrder", newOrder);
                await newOrder.save();
                console.log("newOrder saved", newOrder);

                console.log("newOrder saved", newOrder);

                return res.status(200).json({ status: 'success' });
            } else {
                res.status(400).json({ status: 'error' });
            }
        } catch (error) {
            console.error("Error during Stripe payment intent retrieval:", error);
            res.status(500).json({ error: 'An error occurred while retrieving the payment intent' });
        }
    } else {
        res.status(400).json({ error: 'Unsupported payment method' });
    }
});




// Create payment intent for Stripe
// router.post('/create-payment-intent', async (req, res) => {
//     const { paymentMethodId, amount } = req.body;
//     console.log("/create-payment-intent - paymentMethodId:", paymentMethodId);
//     console.log("/create-payment-intent - amount:", amount);

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//         apiVersion: '2022-08-01',
//     });
//     console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // convert to cents
//             currency: 'usd',
//             payment_method: paymentMethodId,
//             confirmation_method: 'manual',
//             confirm: true,
//         });

//         console.log("/create-payment-intent - paymentIntent:", paymentIntent);

//         res.status(200).json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//         res.status(400).json({ error: error.message });
//     }
// });
router.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2022-08-01',
    });

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            // confirmation_method: 'manual', // 'automatic' also works if not manually confirming
            confirmation_method: 'manual', // 'automatic' also works if not manually confirming
            // confirm: false, // Will confirm client-side
            // confirm: true, // Will confirm client-side
        });

        // console.log("Created Payment Intent: ", paymentIntent);
        console.log("Payment Intent returned by Stripe:", paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntent
        });

        // res.json({ clientSecret: paymentIntent.client_secret, paymentIntent });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: { mesage: error.message } });

    }
});

router.post('/confirm-payment-intent', async (req, res) => {
    const { paymentIntentId } = req.body;
    console.log("Received request to confirm payment intent with ID:", paymentIntentId);

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        console.log("Confirmed Payment Intent: ", paymentIntent);
        res.send({
            paymentIntent
        });
    } catch (error) {
        console.error("Error confirming Payment Intent: ", error);
        res.status(400).send({
            error: {
                message: error.message,
            }
        });
    }
});

export default router;

