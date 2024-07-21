import React, { useState, useEffect, useRef } from 'react';
import { Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
console.log("serverURL", serverURL);

const PaymentMethod = ({ nextStep, prevStep, getTotal, handlePaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const paypalContainerRef = useRef(null);

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value !== 'paypal') {
            setPaypalLoaded(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep(paymentMethod);
    };

    useEffect(() => {
        const loadPaypalButtons = () => {
            if (paypalContainerRef.current) {
                paypalContainerRef.current.innerHTML = '';
                window.paypal.Buttons({
                    createOrder: async (data, actions) => {
                        try {
                            // scrivi axios.post per creare l'ordine utilizzando la costante serverURL

                            const response = await axios.post(`${serverURL}/orders/`, {
                                action: 'create',
                                total: getTotal(),
                            });
                            return response.data.id;
                        } catch (error) {
                            console.error('Error creating order:', error);
                        }
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const response = await axios.post(`${serverURL}/orders/`, {
                                action: 'capture',
                                orderID: data.orderID,
                            });
                            if (response.data.status === 'COMPLETED') {
                                console.log('Payment Approved: ', response.data);
                                const paymentDetails = { ...response.data, orderID: data.orderID };
                                console.log('Payment Details:', paymentDetails);
                                // handlePaymentSuccess(response.data); // Call handlePaymentSuccess with payment details
                                handlePaymentSuccess(paymentDetails); // Call handlePaymentSuccess with payment details
                            }
                        } catch (error) {
                            console.error('Error capturing order:', error);
                        }
                    },
                    onError: (err) => {
                        console.error('Error: ', err);
                    }
                }).render(paypalContainerRef.current);
            }
        };

        if (paymentMethod === 'paypal' && !paypalLoaded) {
            if (!document.querySelector('script[src="https://www.paypal.com/sdk/js?client-id=ATIMh-61ppJmOSL_juZPv1o4bq1U8Z-Tv8QwywWRa9Cf7fVfogCpvEV_qQXIVqeMhFAQQjFMfD802oiA"]')) {
                const script = document.createElement('script');
                script.src = "https://www.paypal.com/sdk/js?client-id=ATIMh-61ppJmOSL_juZPv1o4bq1U8Z-Tv8QwywWRa9Cf7fVfogCpvEV_qQXIVqeMhFAQQjFMfD802oiA";
                script.onload = loadPaypalButtons;
                document.body.appendChild(script);
            } else {
                loadPaypalButtons();
            }
            setPaypalLoaded(true);
        }
    }, [paymentMethod, paypalLoaded, getTotal, handlePaymentSuccess]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Payment Method
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Select Payment Method</FormLabel>
                    <RadioGroup value={paymentMethod} onChange={handleChange}>
                        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                        <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                    </RadioGroup>
                </FormControl>
                {paymentMethod === 'paypal' && (
                    <Box id="paypal-button-container" ref={paypalContainerRef} style={{ marginTop: '20px', maxWidth: '400px' }}></Box>
                )}
                {paymentMethod !== 'paypal' && (
                    <div style={{ marginTop: '20px' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Next
                        </Button>
                    </div>
                )}
            </form>
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="secondary" onClick={prevStep}>
                    Back
                </Button>
            </div>
        </Container>
    );
};

export default PaymentMethod;

