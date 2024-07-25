import React, { useState } from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography } from '@mui/material';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

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

        console.log("Created Payment Method: ", paymentMethod);
        if (error) {
            console.error("Error creating Payment Method: ", error);
            setLoading(false);
            setError(error);
            return;
        }

        // try {
        //     const response = await axios.post(`${serverURL}/orders/create-payment-intent`, {
        //         paymentMethodId: paymentMethod.id,
        //         amount: parseFloat(total) // Assicurati che total sia un numero
        //     }, {
        //         headers: { 'Content-Type': 'application/json' }
        //     });

        //     const paymentIntentRes = response.data;
        //     console.log("CreditCardForm - paymentIntentRes: ", paymentIntentRes)
        //     if (paymentIntentRes.error) {
        //         console.error(paymentIntentRes.error);
        //         setLoading(false);
        //         setError(paymentIntentRes.error);
        //         return;
        //     }

        //     // const { clientSecret } = paymentIntentRes;
        //     const { status, clientSecret } = paymentIntentRes;
        //     console.log("Payment Intent Status before confirmation: ", status);
        //     if (status !== 'requires_confirmation') {
        //         console.error("Unexpected Payment Intent status: ", status);
        //         setError({ message: "Unexpected Payment Intent status" });
        //         return;
        //     }
        //     console.log("CreditCardForm - clientSecret: ", clientSecret)
        //     console.log("CreditCardForm - paymentMethod: ", paymentMethod)

        //     // Fetch payment intent to check its status
        //     const paymentIntentStatus = await stripe.retrievePaymentIntent(clientSecret);
        //     console.log("CreditCardForm - paymentIntentStatus: ", paymentIntentStatus);

        //     if (paymentIntentStatus.paymentIntent.status !== 'requires_confirmation') {
        //         console.error('Unexpected Payment Intent state', paymentIntentStatus.paymentIntent.status);
        //         setLoading(false);
        //         setError(new Error('PaymentIntent is in an unexpected state.'));
        //         return;
        //     }

        //     const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        //         payment_method: paymentMethod.id,
        //     });

        //     if (confirmError) {
        //         console.error('Payment failed', confirmError);
        //         setError(confirmError);
        //     } else {
        //         console.log('Payment succeeded, PaymentIntent: ', paymentIntent);
        //         handlePaymentSuccess(paymentIntent);
        //     }

        //     console.log("Confirmed Payment Intent: ", paymentIntent);
        //     if (confirmError) {
        //         console.error('Payment failed', confirmError);
        //         setError(confirmError);
        //     } else if (paymentIntent) {
        //         handlePaymentSuccess(paymentIntent);
        //     } else {
        //         console.error('PaymentIntent is undefined');
        //     }
        // try {
        //     const response = await axios.post(`${serverURL}/orders/create-payment-intent`, {
        //         paymentMethodId: paymentMethod.id,
        //         amount: parseFloat(total)
        //     }, {
        //         headers: { 'Content-Type': 'application/json' }
        //     });

        //     const paymentIntentRes = response.data;
        //     console.log("CreditCardForm - paymentIntentRes: ", paymentIntentRes);

        //     if (paymentIntentRes.error) {
        //         console.error("Error in Payment Intent Response: ", paymentIntentRes.error);
        //         setLoading(false);
        //         setError(paymentIntentRes.error);
        //         return;
        //     }

        //     const { clientSecret, paymentIntent } = paymentIntentRes;
        //     console.log("Client Secret: ", clientSecret);
        //     console.log("Payment Intent: ", paymentIntent);

        //     if (!paymentIntent || !paymentIntent.status) {
        //         console.error("Unexpected Payment Intent status: ", paymentIntent ? paymentIntent.status : 'undefined');
        //         setError({ message: "Unexpected Payment Intent status" });
        //         setLoading(false);
        //         return;
        //     }

        //     console.log("Payment Intent Status before confirmation: ", paymentIntent.status);
        //     if (paymentIntent.status !== 'requires_confirmation') {
        //         console.error("Unexpected Payment Intent status: ", paymentIntent.status);
        //         setError({ message: "Unexpected Payment Intent status" });
        //         setLoading(false);
        //         return;
        //     }

        //     const { error: confirmError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        //         payment_method: paymentMethod.id,
        //     });

        //     if (confirmError) {
        //         console.error('Payment failed', confirmError);
        //         setError(confirmError);
        //     } else if (confirmedPaymentIntent) {
        //         console.log('Payment succeeded, PaymentIntent: ', confirmedPaymentIntent);
        //         handlePaymentSuccess(confirmedPaymentIntent);
        //     } else {
        //         console.error('PaymentIntent is undefined');
        //     }
        // } catch (error) {
        //     console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
        //     setError(error);
        // }

        // setLoading(false);
        // try {
        //     const response = await axios.post(`${serverURL}/orders/create-payment-intent`, {
        //         paymentMethodId: paymentMethod.id,
        //         amount: parseFloat(total)
        //     }, {
        //         headers: { 'Content-Type': 'application/json' }
        //     });

        //     const paymentIntentRes = response.data;
        //     console.log("CreditCardForm - paymentIntentRes: ", paymentIntentRes);

        //     if (paymentIntentRes.error) {
        //         console.error("Error in Payment Intent Response: ", paymentIntentRes.error);
        //         setLoading(false);
        //         setError(paymentIntentRes.error);
        //         return;
        //     }

        //     const { clientSecret, paymentIntent } = paymentIntentRes;
        //     console.log("Client Secret: ", clientSecret);
        //     console.log("Payment Intent: ", paymentIntent);

        //     if (!paymentIntent || !paymentIntent.status) {
        //         console.error("Unexpected Payment Intent status: ", paymentIntent ? paymentIntent.status : 'undefined');
        //         setError({ message: "Unexpected Payment Intent status" });
        //         setLoading(false);
        //         return;
        //     }

        //     console.log("Payment Intent Status before confirmation: ", paymentIntent.status);
        //     if (paymentIntent.status !== 'requires_confirmation') {
        //         console.error("Unexpected Payment Intent status: ", paymentIntent.status);
        //         setError({ message: "Unexpected Payment Intent status" });
        //         setLoading(false);
        //         return;
        //     }

        //     const { error: confirmError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        //         payment_method: paymentMethod.id,
        //     });

        //     if (confirmError) {
        //         console.error('Payment failed', confirmError);
        //         setError(confirmError);
        //     } else if (confirmedPaymentIntent) {
        //         console.log('Payment succeeded, PaymentIntent: ', confirmedPaymentIntent);
        //         handlePaymentSuccess(confirmedPaymentIntent);
        //     } else {
        //         console.error('PaymentIntent is undefined');
        //     }
        // } catch (error) {
        //     console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
        //     setError(error);
        // }

        // setLoading(false);

        try {
            const response = await axios.post(`${serverURL}/orders/create-payment-intent`, {
                paymentMethodId: paymentMethod.id,
                amount: parseFloat(total)
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const paymentIntentRes = response.data;
            console.log("CreditCardForm - paymentIntentRes: ", paymentIntentRes);

            if (paymentIntentRes.error) {
                console.error("Error in Payment Intent Response: ", paymentIntentRes.error);
                setLoading(false);
                setError(paymentIntentRes.error);
                return;
            }

            const { paymentIntent } = paymentIntentRes;
            console.log("Payment Intent: ", paymentIntent);

            if (!paymentIntent || !paymentIntent.status) {
                console.error("Unexpected Payment Intent status: ", paymentIntent ? paymentIntent.status : 'undefined');
                setError({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

            console.log("Payment Intent Status before confirmation: ", paymentIntent.status);
            if (paymentIntent.status !== 'requires_confirmation') {
                console.error("Unexpected Payment Intent status: ", paymentIntent.status);
                setError({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

            const confirmResponse = await axios.post(`${serverURL}/orders/confirm-payment-intent`, {
                paymentIntentId: paymentIntent.id,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const confirmedPaymentIntent = confirmResponse.data.paymentIntent;

            if (confirmedPaymentIntent.status === 'succeeded') {
                console.log('Payment succeeded, PaymentIntent: ', confirmedPaymentIntent);
                handlePaymentSuccess(confirmedPaymentIntent);
            } else {
                console.error('Payment failed');
                setError({ message: 'Payment failed' });
            }
        } catch (error) {
            console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
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


