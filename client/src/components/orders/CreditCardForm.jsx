import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography } from '@mui/material';

import { confirmPaymentIntent, createPaymentIntent } from '../../services/ordersServices';


const CreditCardForm = ({ handlePaymentSuccess, total }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error("Error creating Payment Method: ", error);
            setLoading(false);
            setError(error);
            return;
        }

        // create payment Intent
        try {
            const paymentIntentRes = await createPaymentIntent(paymentMethod.id, total);

            if (paymentIntentRes.error) {
                console.error("Error in Payment Intent Response: ", paymentIntentRes.error);
                setLoading(false);
                setError(paymentIntentRes.error);
                return;
            }

            const { paymentIntent } = paymentIntentRes;

            if (!paymentIntent || !paymentIntent.status) {
                console.error("Unexpected Payment Intent status: ", paymentIntent ? paymentIntent.status : 'undefined');
                setError({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

            if (paymentIntent.status !== 'requires_confirmation') {
                setError({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

        } catch (error) {
            console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
            setError(error);
        }

        // confirm payment intent
        try {
            const confirmResponse = await confirmPaymentIntent(paymentIntent.id);

            const confirmedPaymentIntent = confirmResponse.paymentIntent;

            if (confirmedPaymentIntent.status === 'succeeded') {
                handlePaymentSuccess(confirmedPaymentIntent);
            } else {
                console.error('Payment failed');
                setError({ message: 'Payment failed' });
            }
        
        } catch (error) {
            console.error('Error confirming payment intent:', error.response ? error.response.data : error.message);
            setError(error);
        }
        setLoading(false);
    };


    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Credit Card Details
            </Typography>
            <CardElement />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                style={{ marginTop: '20px' }}
            >
                {loading ? 'Processing...' : 'Pay'}
            </Button>
            {error && <Typography color="error">{error.message}</Typography>}
        </form>
    );
};

export default CreditCardForm;


