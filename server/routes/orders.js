import {
    createPayPalOrder,
    createCreditCardOrder,
    createStripePaymentIntent,
    confirmStripePaymentIntent,
    getOrderHistory,
    updateOrderStatus,
    getAllOrders,
    getAllUsersWithOrders,
    isOrderDelivered,
} from '../controllers/orders.js';

import { isAuthenticated, isAdmin } from '../middleware/auth.js';

import express from 'express';

const router = express.Router();

// PayPal
router.post('/paypal-order', isAuthenticated, createPayPalOrder);
router.post('/credit-card-order', isAuthenticated, createCreditCardOrder);

// Credit Card
router.post('/create-payment-intent', isAuthenticated, createStripePaymentIntent);
router.post('/confirm-payment-intent', isAuthenticated, confirmStripePaymentIntent);

// Orders history
router.get('/history/:userId', isAuthenticated, getOrderHistory);

// Orders management
router.get('/delivered/:productId,:userId', isAuthenticated, isOrderDelivered);

// Admin routes
router.patch('/update-order-status/:orderId', isAuthenticated, isAdmin, updateOrderStatus); 
router.get('/', isAuthenticated, isAdmin, getAllOrders); 
router.get('/users-with-orders', isAuthenticated, isAdmin, getAllUsersWithOrders);


export default router;
