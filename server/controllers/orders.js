import paypal from '@paypal/checkout-server-sdk';
import Stripe from 'stripe';

import Order from '../models/Order.js';



// PAYPAL

// utility functions
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

// PayPal controllers

export const createPayPalOrder = async (req, res) => {
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails } = req.body;

    if (paymentMethod === 'paypal') {

        const paypalClient = createPayPalClient();

        try {
            const orderDetails = await getOrderDetails(paymentDetails.id, paypalClient);

            if (orderDetails.status === 'COMPLETED') {
                const existingOrder = await Order.findOne({ paypalOrderId: paymentDetails.id });
                if (existingOrder) {
                    return res.status(200).json({ status: 'success' });
                }

                console.log("*** create PayPal order - totalAmount: ", totalAmount);
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
            if (error.response && error.response.statusCode === 422) {
                const errorData = error.response.result;
                if (errorData.details && errorData.details[0].issue === 'ORDER_ALREADY_CAPTURED') {
                    return res.status(400).json({ error: 'Order already captured' });
                }
            }
            res.status(500).json({ error: 'An error occurred while capturing the order' });
        }
    }
}


// CREDIT CARD
export const createCreditCardOrder = async (req, res) => {
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails } = req.body;
    if (paymentMethod === 'credit-card') {

        const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

        try {
            const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentDetails.id);

            if (paymentIntent.status === 'succeeded') {

                const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentDetails.id });
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
                // create new order
                const newOrder = new Order(newOrderParams);
                await newOrder.save();

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
}

let stripe = null;

export const createStripePaymentIntent = async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-08-01',
    });

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirmation_method: 'manual'
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntent
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: { mesage: error.message } });

    }
}

export const confirmStripePaymentIntent = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        res.send({
            paymentIntent
        });
    } catch (error) {
        res.status(400).send({
            error: {
                message: error.message,
            }
        });
    }
}

