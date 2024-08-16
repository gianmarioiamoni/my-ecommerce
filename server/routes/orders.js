import {
    createPayPalOrder,
    createCreditCardOrder,
    createStripePaymentIntent,
    confirmStripePaymentIntent,
    getOrderHistory,
    updateOrderStatus,
    getAllOrders,
    getAllUsersWithOrders
} from '../controllers/orders.js';

import express from 'express';

const router = express.Router();

// PayPal
router.post('/paypal-order', createPayPalOrder);
router.post('/credit-card-order', createCreditCardOrder);

// Credit Card
router.post('/create-payment-intent', createStripePaymentIntent);
router.post('/confirm-payment-intent', confirmStripePaymentIntent);

// Orders history
router.get('/history/:userId', getOrderHistory);

// Admin routes
router.patch('/update-order-status/:orderId', updateOrderStatus); 
router.get('/', getAllOrders); 
router.get('/users-with-orders', getAllUsersWithOrders);

export default router;
