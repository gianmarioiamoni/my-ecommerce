import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ShippingForm from '../components/orders/ShippingForm';
import PaymentMethod from '../components/orders/PaymentMethod';
import ReviewOrder from '../components/orders/ReviewOrder';

import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

import { createPayPalOrder, createCreditCardOrder } from '../services/ordersServices';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


const Checkout = () => {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const nextStep = (data) => {
        if (step === 1) {
            setShippingData(data);
        } else if (step === 2) {
            setPaymentMethod(data);
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

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
                alert('This order has already been captured.');
            } else {
                alert('An error occurred while placing the order. Please try again.');
            }
        }
    };

    // In the component
    const handlePayPalPaymentSuccess = (details) => {
        if (details.id && details.status === 'COMPLETED') {
            handlePaymentSuccess(details);
        } else {
            alert('Invalid PayPal payment details');
        }
    };

    const handleStripePaymentSuccess = (paymentIntent) => {
        if (!paymentIntent) {
            throw new Error("Payment Intent is undefined");
        }
        if (paymentIntent.id && paymentIntent.status === 'succeeded') {
            handlePaymentSuccess(paymentIntent);
        } else {
            alert('Invalid Stripe payment details');
        }
    };

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


