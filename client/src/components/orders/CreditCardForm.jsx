import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, Select, MenuItem, FormControl, InputLabel, Box, Container } from '@mui/material';

import { confirmPaymentIntent, createPaymentIntent } from '../../services/ordersServices';
import { getPaymentMethods } from '../../services/usersServices';

import { useTranslation } from 'react-i18next';

/**
 * The CreditCardForm component renders a form to enter credit card details
 * and pays for the order using Stripe.
 *
 * @param {Object} handlePaymentSuccess - the function to call when the payment is successful
 * @param {Object} total - the total amount of the order
 * @param {String} userId - the id of the user making the order
 */
const CreditCardForm = ({ handlePaymentSuccess, total, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedMethodDetails, setSelectedMethodDetails] = useState(null);
    const [defaultMethodId, setDefaultMethodId] = useState('');

    const { t, i18n } = useTranslation();


    // useQuery to fetch the user's payment methods
    const { data, isLoading, error } = useQuery(['paymentMethods', userId], () => getPaymentMethods(userId), {
        onSuccess: (result) => {
            if (!result.error) {
                setPaymentMethods(result);

                if (result.length > 0) {
                    const defaultMethod = result[0];
                    setSelectedPaymentMethod(defaultMethod._id);
                    setSelectedMethodDetails(defaultMethod);
                    setDefaultMethodId(defaultMethod._id);
                }
            }
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching payment methods</p>;


    /**
     * Handles the change of the selected payment method
     * and updates the selected method details accordingly.
     *
     * @param {Object} e - the event object
     */
    const handlePaymentMethodChange = (e) => {
        const paymentMethodId = e.target.value;
        setSelectedPaymentMethod(paymentMethodId);

        // Find the selected method and set the details
        const selectedMethod = paymentMethods.find(method => method._id === paymentMethodId);
        if (selectedMethod) {
            setSelectedMethodDetails(selectedMethod);
        } else {
            // Reset the selected method details if the user selects an invalid option
            setSelectedMethodDetails(null);
        }
    };

    /**
     * Handles the submission of the credit card form.
     *
     * @param {Object} event - the event object
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            // If the Stripe library is not loaded, stop the submission
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create a new Payment Method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            // Handle errors creating the payment method
            console.error("Error creating Payment Method: ", error);
            setLoading(false);
            setErrorMsg(error);
            return;
        }

        try {
            // Create a new Payment Intent
            const paymentIntentRes = await createPaymentIntent(paymentMethod.id, total);

            if (paymentIntentRes.error) {
                // Handle errors in the payment intent response
                console.error("Error in Payment Intent Response: ", paymentIntentRes.error);
                setLoading(false);
                setErrorMsg(paymentIntentRes.error);
                return;
            }

            const { paymentIntent } = paymentIntentRes;

            if (!paymentIntent || !paymentIntent.status) {
                // Handle unexpected payment intent status
                console.error("Unexpected Payment Intent status: ", paymentIntent ? paymentIntent.status : 'undefined');
                setErrorMsg({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

            if (paymentIntent.status !== 'requires_confirmation') {
                // Handle payment intent status that is not 'requires_confirmation'
                setErrorMsg({ message: "Unexpected Payment Intent status" });
                setLoading(false);
                return;
            }

            // Confirm the Payment Intent
            const confirmResponse = await confirmPaymentIntent(paymentIntent.id);

            const confirmedPaymentIntent = confirmResponse.paymentIntent;

            if (confirmedPaymentIntent.status === 'succeeded') {
                // Handle successful payment
                handlePaymentSuccess(confirmedPaymentIntent);
            } else {
                // Handle failed payment
                console.error('Payment failed');
                setErrorMsg({ message: 'Payment failed' });
            }
        } catch (error) {
            // Handle any other errors
            console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
            setErrorMsg(error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="sm"> {/* Contain the form in a smaller container */}
            <Box
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    marginTop: 4,
                    marginBottom: 4
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {/* Credit Card Details */}
                    {t('payment.creditCardDetails')}
                </Typography>

                {paymentMethods.length > 0 && (
                    <FormControl fullWidth margin="normal" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <InputLabel id="payment-method-select-label">{t('selectSavedPaymentMethod')}</InputLabel>
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
                                    {method.cardType} {t('payment.endingIn')} {method.last4Digits}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {selectedMethodDetails && (
                    <Typography variant="body1" gutterBottom>
                        {t('payment.selectedCard')}: {selectedMethodDetails.cardType} - {selectedMethodDetails.cardNumber} <br />
                        {t('payment.expiringDate')}: {selectedMethodDetails.expiryDate}
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
                    onClick={handleSubmit}
                >
                    {loading ? t('payment.processing') : t('payment.pay')}
                </Button>
                {errorMsg && <Typography color="error" style={{ marginTop: '20px' }}>{errorMsg.message}</Typography>}
            </Box>
        </Container>
    );
};

export default CreditCardForm;

