import express from 'express';
import paypal from '@paypal/checkout-server-sdk';

import Order from '../models/Order.js';

const router = express.Router();

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

    console.log("PAYMENT DETAILS:", paymentDetails);
    console.log("PAYMENT METHOD:", paymentMethod);

    const paypalClient = createPayPalClient();

    console.log("PAYPAL CLIENT:", paypalClient);

    if (paymentMethod === 'paypal') {
        try {
            const orderDetails = await getOrderDetails(paymentDetails.id, paypalClient);
            console.log("ORDER DETAILS:", orderDetails);

            // Check if order is already completed
            if (orderDetails.status === 'COMPLETED') {
                // console.error('Order already captured');
                // return res.status(400).json({ error: 'Order already captured' });

                // Logica per salvare l'ordine nel database
                const existingOrder = await Order.findOne({ paypalOrderId: paymentDetails.id });
                if (existingOrder) {
                    return res.status(200).json({ status: 'success' });
                }

                // Create new order
                const newOrder = new Order({
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    paypalOrderId: paymentDetails.id,
                });

                await newOrder.save();

                return res.status(200).json({ status: 'success' });
            }
            // If not captured capture the order
            const request = new paypal.orders.OrdersCaptureRequest(paymentDetails.id);
            request.requestBody({});
            const capture = await paypalClient.execute(request);
            console.log("CAPTURE RESULT:", capture.result);

            if (capture.result.status === 'COMPLETED') {
                // Logica per salvare l'ordine nel database
                // Create new order
                const newOrder = new Order({
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    paypalOrderId: paymentDetails.id,
                });

                await newOrder.save();

                res.status(200).json({ status: 'success' });
            } else {
                res.status(400).json({ status: 'error' });
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
    } else {
        res.status(400).json({ error: 'Unsupported payment method' });
    }
});

export default router;


