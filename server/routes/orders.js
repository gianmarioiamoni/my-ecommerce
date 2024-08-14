import {
    createPayPalOrder,
    createCreditCardOrder,
    createStripePaymentIntent,
    confirmStripePaymentIntent,
    getOrderHistory
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


export default router;

