import { createPayPalOrder, createCreditCardOrder, createStripePaymentIntent, confirmStripePaymentIntent } from '../controllers/orders.js';

import express from 'express';

const router = express.Router();


// PayPal
router.post('/paypal-order', createPayPalOrder);
router.post('/credit-card-order', createCreditCardOrder);

// Credit Card
router.post('/create-payment-intent', createStripePaymentIntent);
router.post('/confirm-payment-intent', confirmStripePaymentIntent);

export default router;

