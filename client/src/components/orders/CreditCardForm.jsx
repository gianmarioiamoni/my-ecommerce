import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, Select, MenuItem, FormControl, InputLabel, Box, Container } from '@mui/material';

import { confirmPaymentIntent, createPaymentIntent } from '../../services/ordersServices';
import { getPaymentMethods } from '../../services/usersServices';

const CreditCardForm = ({ handlePaymentSuccess, total, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedMethodDetails, setSelectedMethodDetails] = useState(null);
    const [defaultMethodId, setDefaultMethodId] = useState('');

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            const result = await getPaymentMethods(userId);
            if (!result.error) {
                setPaymentMethods(result);

                if (result.length > 0) {
                    const defaultMethod = result[0];
                    setSelectedPaymentMethod(defaultMethod._id);
                    setSelectedMethodDetails(defaultMethod);
                    setDefaultMethodId(defaultMethod._id);
                }
            }
        };
        fetchPaymentMethods();
    }, [userId]);

    const handlePaymentMethodChange = (e) => {
        const paymentMethodId = e.target.value;
        setSelectedPaymentMethod(paymentMethodId);

        const selectedMethod = paymentMethods.find(method => method._id === paymentMethodId);
        if (selectedMethod) {
            setSelectedMethodDetails(selectedMethod);
        } else {
            setSelectedMethodDetails(null);
        }
    };

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

            const confirmResponse = await confirmPaymentIntent(paymentIntent.id);

            const confirmedPaymentIntent = confirmResponse.paymentIntent;

            if (confirmedPaymentIntent.status === 'succeeded') {
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
        <Container maxWidth="sm"> {/* Contain the form in a smaller container */}
            <Box
                sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    marginTop: 4,
                    marginBottom: 4
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Credit Card Details
                </Typography>

                {paymentMethods.length > 0 && (
                    <FormControl fullWidth margin="normal" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <InputLabel id="payment-method-select-label">Select a Saved Payment Method</InputLabel>
                        <Select
                            labelId="payment-method-select-label"
                            value={selectedPaymentMethod}
                            onChange={handlePaymentMethodChange}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem
                                    key={method._id}
                                    value={method._id}
                                    style={method._id === defaultMethodId ? { fontWeight: 'bold', backgroundColor: '#f0f0f0' } : {}}
                                >
                                    {method.cardType} ending in {method.last4Digits}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {selectedMethodDetails && (
                    <Typography variant="body1" gutterBottom>
                        Selected Card: {selectedMethodDetails.cardType} - {selectedMethodDetails.cardNumber} <br />
                        Expiry Date: {selectedMethodDetails.expiryDate}
                    </Typography>
                )}

                <Box sx={{ marginTop: 2 }}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    letterSpacing: '0.025em',
                                    fontFamily: 'Source Code Pro, monospace',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    {loading ? 'Processing...' : 'Pay'}
                </Button>
                {error && <Typography color="error" style={{ marginTop: '20px' }}>{error.message}</Typography>}
            </Box>
        </Container>
    );
};

export default CreditCardForm;

