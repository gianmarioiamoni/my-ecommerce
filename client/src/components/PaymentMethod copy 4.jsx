import React, { useState, useEffect, useRef } from 'react';
import { Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';

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
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: getTotal()
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            console.log('Payment Approved: ', details);
                            handlePaymentSuccess(details); // Call handlePaymentSuccess with payment details
                        });
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
