import paypal from '@paypal/checkout-server-sdk';
import Stripe from 'stripe';

import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';


// PAYPAL

// utility functions

/**
 * Creates a PayPal client with the given client ID and client secret.
 * 
 * @param {String} clientId The client ID for the PayPal API
 * @param {String} clientSecret The client secret for the PayPal API
 * @returns {PayPalHttpClient} The PayPal client
 * @throws {Error} If the client ID or client secret are missing
 */
const createPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing");
        throw new Error("Missing PayPal credentials");
    }

    // Create the PayPal client
    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    return client;
};

/**
 * Retrieves the details of a PayPal order by the given order ID.
 * 
 * @param {String} orderId The ID of the PayPal order
 * @param {PayPalHttpClient} paypalClient The PayPal client to use for the request
 * @returns {Promise<Object>} The details of the PayPal order
 */
const getOrderDetails = async (orderId, paypalClient) => {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await paypalClient.execute(request);
    return response.result;
};

/**
 * Saves a new order to the database and updates the quantity of each product in the order.
 * 
 * @param {Object} newOrder The new order to be saved
 * @returns {Promise<Object>} The saved order
 */
const saveOrder = async (newOrder) => {
    const savedOrder = await newOrder.save();

    // if order is saved successfully, update quantity per each product in the cart
    // otherwise return error
    if (savedOrder) {
        // per each product in the cart, update the product quantity 
        // in the database by subtracting the purchased quantity
        // savedOrder.products is an array of objects { product, quantity }
        for (const item of savedOrder.products) {
            const product = await Product.findById(item.product);
            // check if remaining quantity is less than 0
            if (product.quantity - item.quantity < 0) {
                // delete the order and return error
                await Order.deleteOne({ _id: savedOrder._id });
                return res.status(400).json({ status: 'error: insufficient stock' });
            }
            product.quantity -= item.quantity;
            await product.save();
        }
        return savedOrder; 
    } else {
        return null;
    }
}


// PayPal controllers


/**
 * Creates a new order in the database when a PayPal payment is successful.
 * 
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * 
 * @returns {Promise<void>}
 */
export const createPayPalOrder = async (req, res) => {
    const {
        shippingData,
        paymentMethod,
        cartItems,
        totalAmount,
        paymentDetails,
        userId
    } = req.body;

    if (paymentMethod === 'paypal') {
        const paypalClient = createPayPalClient();

        try {
            // Get the order details from PayPal
            const orderDetails = await getOrderDetails(paymentDetails.id, paypalClient);

            if (orderDetails.status === 'COMPLETED') {
                // Check if the order already exists in the database
                const existingOrder = await Order.findOne({ paypalOrderId: paymentDetails.id });
                if (existingOrder) {
                    return res.status(200).json({ status: 'success' });
                }

                // Create a new order in the database
                const newOrder = new Order({
                    userId: userId,
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    paypalOrderId: paymentDetails.id || undefined,
                });

                const savedOrder = await saveOrder(newOrder);

                if (savedOrder) {
                    res.status(200).json({ status: 'success' });
                } else {
                    res.status(400).json({ status: 'error' });
                }
                
            } else {
                // Capture the order on PayPal
                const request = new paypal.orders.OrdersCaptureRequest(paymentDetails.id);
                request.requestBody({});
                const capture = await paypalClient.execute(request);

                if (capture.result.status === 'COMPLETED') {
                    // Create a new order in the database
                    const newOrder = new Order({
                        products: cartItems.map(item => ({
                            product: item._id,
                            quantity: item.quantity,
                        })),
                        totalAmount,
                        paypalOrderId: paymentDetails.id || undefined,
                    });

                    const savedOrder = await saveOrder(newOrder);

                    if (savedOrder) {
                        res.status(200).json({ status: 'success' });
                    } else {
                        res.status(400).json({ status: 'error' });
                    }

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


/**
 * Creates a new order in the database using the payment intent id.
 * This function is called when the user submits the credit card form.
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 */
export const createCreditCardOrder = async (req, res) => {
    const { paymentMethod, cartItems, totalAmount, paymentDetails, userId } = req.body;
    if (paymentMethod === 'credit-card') {

        const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

        try {
            // Retrieve the payment intent from Stripe
            const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentDetails.id);

            if (paymentIntent.status === 'succeeded') {

                // Check if the order already exists in the database
                const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentDetails.id });
                if (existingOrder) {
                    // If the order already exists, return a success response
                    return res.status(200).json({ status: 'success' });
                }

                // Create new order parameters
                const newOrderParams = {
                    userId: userId,
                    products: cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    totalAmount,
                    stripePaymentIntentId: paymentDetails.id || undefined,
                };
                const newOrder = new Order(newOrderParams);
                const savedOrder = await saveOrder(newOrder);
                if (savedOrder) {
                    res.status(200).json({ status: 'success' });
                } else {
                    res.status(400).json({ status: 'error' });
                }

            } else {
                // Return an error response if the payment intent is not in a succeeded status
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

/**
 * Creates a new Stripe payment intent.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * @param {string} req.body.paymentMethodId The ID of the payment method.
 * @param {number} req.body.amount The amount of the payment in USD.
 *
 * @returns {Promise<void>}
 */
export const createStripePaymentIntent = async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    // Initialize Stripe with the secret key.
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-08-01',
    });

    try {
        // Create a new payment intent.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // The amount of the payment in cents and to integer
            currency: 'usd', 
            payment_method: paymentMethodId, // Set the payment method to the one provided in the request body.
            confirmation_method: 'manual' // Set the confirmation method to manual, so the user can confirm the payment.
        });

        // Send the client secret and the payment intent to the client.
        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntent
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: { message: error.message } });
    }
}

/**
 * Confirms a Stripe payment intent.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * @param {string} req.body.paymentIntentId The ID of the payment intent.
 *
 * @returns {Promise<void>}
 */
export const confirmStripePaymentIntent = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        // Confirm the payment intent
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        // Return the confirmed payment intent
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


/**
 * Get the order history for the given user.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * @param {string} req.params.userId The ID of the user.
 * @param {Object} req.query The query parameters.
 * @param {number} req.query.page The page of orders to retrieve.
 * @param {number} req.query.limit The number of orders to retrieve per page.
 * @param {string} req.query.sort The field to sort the orders by.
 * @param {string} req.query.order The order to sort the orders in.
 * @param {string} req.query.search The search query to filter the orders by.
 * @param {string} req.query.startDate The start date of the range to filter the orders by.
 * @param {string} req.query.endDate The end date of the range to filter the orders by.
 *
 * @returns {Promise<void>}
 */
export const getOrderHistory = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', startDate, endDate } = req.query;

    const query = { userId };

    // Add date range query to look for orders within the specified date range
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
            query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            query.createdAt.$lte = new Date(endDate);
        }
    }

    // Add search query to look for the product name
    if (search) {
        query['products'] = {
            $elemMatch: {
                'product.name': { $regex: search, $options: 'i' }
            }
        };
    }

    try {
        const orders = await Order.find(query)
            .populate('products.product')
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(query);

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

/**
 * Updates the status of an order.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * @param {string} req.params.orderId The ID of the order to update.
 * @param {string} req.body.status The new status of the order.
 * 
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Check if the status is valid
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

/**
 * Returns all orders in the database.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId').populate('products.product');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

/**
 * Returns all users who have placed an order.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * 
 * @returns {Promise<void>}
 */
export const getAllUsersWithOrders = async (req, res) => {
    try {
        // Get IDs of users with orders
        // Distinct returns an array of all unique values in the specified field
        const usersWithOrders = await Order.distinct('userId');

        // Fetch data of these users
        // Find method returns all documents that match the filter
        // $in operator is used to match values in an array
        const users = await User.find({ _id: { $in: usersWithOrders } });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users with orders:', error);
        res.status(500).json({ message: 'Error fetching users with orders' });
    }
};

/**
 * Checks if an order has been delivered.
 * 
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 * @param {string} req.params.productId The ID of the product in the order.
 * @param {string} req.params.userId The ID of the user who placed the order.
 * 
 * @returns {Promise<void>}
 */
export const isOrderDelivered = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        // Find the order in the database
        // Find in the database if there is an Order with the userId and in which
        // the products array contains a product with the productId
        // products.product is an array of objects { productId, quantity }

        // step 1.: find all orders of the user in the delivered status
        const orders = await Order.find({ userId: userId, status: 'Delivered' });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // in the orders array, find if there is an order with the productId in the products array
        // The products array is an array of objects { product, quantity } where product is an ObjectId
        const order = orders.find(order => order.products.some(p => p.product._id.toString() === productId));

        if (!order) {
            return res.status(201).json({ message: 'No orders with delivered status found' });
        }

        res.status(200).json({ message: 'Order delivered' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
