// src/pages/Checkout.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next'; // Importa useTranslation

import ShippingForm from '../../components/orders/ShippingForm';
import PaymentMethod from '../../components/orders/PaymentMethod';
import ReviewOrder from '../../components/orders/ReviewOrder';

import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

import { createPayPalOrder, createCreditCardOrder } from '../../services/ordersServices';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * The Checkout component is the main component for the checkout process.
 * It handles the checkout flow by rendering the correct component based on the current step.
 * The component also handles the payment success callback and the navigation to the success page.
 * 
 * @returns {ReactElement} The rendered component
 */
const Checkout = () => {
    const { t } = useTranslation(''); 

    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');

    const navigate = useNavigate();

    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    /**
     * Handles the next step in the checkout flow
     * @param {Object} data - The data to be passed to the next step
     */
    const nextStep = (data) => {
        if (step === 1) {
            setShippingData(data);
        } else if (step === 2) {
            setPaymentMethod(data);
        }
        setStep(step + 1);
    };

    /**
     * Handles the previous step in the checkout flow
     */
    const prevStep = () => {
        setStep(step - 1);
    };

    /**
     * Handles the payment success callback
     * @param {Object} details - The payment details
     */
    const handlePaymentSuccess = async (details) => {
        try {
            const orderData = {
                userId: user.id,
                shippingData,
                paymentMethod,
                cartItems: cart,
                totalAmount: getTotal(),
                paymentDetails: details
            };

            if (paymentMethod === 'paypal') {
                await createPayPalOrder(orderData);
            }
            else if (paymentMethod === 'credit-card') {
                await createCreditCardOrder(orderData);
            } else {
                throw new Error('Invalid payment method');
            }

            clearCart();
            navigate('/success');
        } catch (error) {
            if (error.response && error.response.data.message === 'Order already captured') {
                alert(t('checkout.orderAlreadyCaptured')); 
            } else {
                alert(t('checkout.orderError')); 
            }
        }
    };

    /**
     * Handles the payment success callback for PayPal
     * @param {Object} details - The payment details
     */
    const handlePayPalPaymentSuccess = (details) => {
        if (details.id && details.status === 'COMPLETED') {
            handlePaymentSuccess(details);
        } else {
            alert(t('checkout.invalidPayPalDetails')); 
        }
    };

    /**
     * Handles the payment success callback for Stripe
     * @param {Object} paymentIntent - The payment intent
     */
    const handleStripePaymentSuccess = (paymentIntent) => {
        if (!paymentIntent) {
            throw new Error(t("checkout.paymentIntentUndefined")); 
        }
        if (paymentIntent.id && paymentIntent.status === 'succeeded') {
            handlePaymentSuccess(paymentIntent);
        } else {
            alert(t('checkout.invalidStripeDetails')); 
        }
    };

    /**
     * Calculates the total amount
     * @returns {number} The total amount
     */
    const getTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    return (
        <Elements stripe={stripePromise}>
            <div>
                {step === 1 && <ShippingForm userId={user.id} nextStep={nextStep} />}
                {step === 2 && <PaymentMethod nextStep={nextStep} prevStep={prevStep} />}
                {step === 3 && (
                    <ReviewOrder
                        shippingData={shippingData}
                        paymentMethod={paymentMethod}
                        prevStep={prevStep}
                        placeOrder={paymentMethod === 'paypal' ? handlePayPalPaymentSuccess : handleStripePaymentSuccess}
                        userId={user.id}
                    />
                )}
            </div>
        </Elements>
    );
};

export default Checkout;



