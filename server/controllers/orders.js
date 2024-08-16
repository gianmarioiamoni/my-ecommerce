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
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails, userId } = req.body;

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
                    userId: userId,
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
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails, userId } = req.body;
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
                    userId: userId,
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

// ORDERS MANAGEMENT

export const getOrderHistory = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', startDate, endDate } = req.query;

    console.log("getOrderHistory() - userId:", userId, "page:", page, "limit:", limit, "sort:", sort, "order:", order, "search:", search, "startDate:", startDate, "endDate:", endDate);

    const query = { userId };

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
            query.createdAt.$gte = new Date(startDate);
            console.log("query.createdAt.$gte:", query.createdAt.$gte);
        }
        if (endDate) {
            query.createdAt.$lte = new Date(endDate);
            console.log("query.createdAt.$lte:", query.createdAt.$lte);
        }
    }

    // Add search query to look for the product name
    if (search) {
        query['products'] = {
            $elemMatch: {
                'product.name': { $regex: search, $options: 'i' }
            }
        };
        console.log("query['products']:", query['products']);
    }

    try {
        const orders = await Order.find(query)
            .populate('products.product')
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        console.log("orders:", orders);

        const totalOrders = await Order.countDocuments(query);

        console.log("totalOrders:", totalOrders);

        res.status(200).json({
            orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: 'An error occurred while fetching the order history' });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['In Progress', 'Shipped', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        console.log("getAllOrders()");
        // const orders = await Order.find().populate('userId', 'name email').populate('products.product');
        const orders = await Order.find({}).populate('userId').populate('products.product');
        console.log("getAllOrders() - orders:", orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};



