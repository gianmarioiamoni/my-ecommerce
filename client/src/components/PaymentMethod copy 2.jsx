import React, { useState, useEffect } from 'react';
import { Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box, TextField } from '@mui/material';

const PaymentMethod = ({ nextStep, prevStep }) => {
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // Default to PayPal for demonstration
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value !== 'paypal') {
            setPaypalLoaded(false); // Reset PayPal loaded state
        }
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({
            ...cardDetails,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (paymentMethod === 'creditCard') {
            // Handle credit card payment submission logic
            console.log('Card Details:', cardDetails);
        }
        nextStep(paymentMethod);
    };

    useEffect(() => {
        if (paymentMethod === 'paypal' && !paypalLoaded) {
            const loadPaypalButtons = () => {
                if (document.getElementById('paypal-button-container').children.length > 0) {
                    document.getElementById('paypal-button-container').innerHTML = ''; // Clear previous buttons
                }
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '0.01' // Replace with actual amount
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            console.log('Payment Approved: ', details);
                            nextStep(paymentMethod);
                        });
                    },
                    onError: (err) => {
                        console.error('Error: ', err);
                    }
                }).render('#paypal-button-container');
            };

            // Load PayPal script if not already loaded
            if (!document.querySelector('script[src="https://www.paypal.com/sdk/js?client-id=Acb_kWdY8XWwVWsp_KgDuzmXZt-Eipg6OYoGysywq6UF8ALobs639iuL32SIvRh4lgf0g14zRavYpR1S"]')) {
                const script = document.createElement('script');
                script.src = "https://www.paypal.com/sdk/js?client-id=Acb_kWdY8XWwVWsp_KgDuzmXZt-Eipg6OYoGysywq6UF8ALobs639iuL32SIvRh4lgf0g14zRavYpR1S";
                script.onload = loadPaypalButtons;
                document.body.appendChild(script);
            } else {
                loadPaypalButtons();
            }

            setPaypalLoaded(true);
        }
    }, [paymentMethod, paypalLoaded, nextStep]);

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
                    <Box id="paypal-button-container" style={{ marginTop: '20px', maxWidth: '400px' }}></Box>
                )}
                {paymentMethod === 'creditCard' && (
                    <Box style={{ marginTop: '20px', maxWidth: '400px' }}>
                        <TextField
                            label="Card Number"
                            name="cc-number"
                            autoComplete="cc-number"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Expiry Date"
                            name="cc-exp"
                            autoComplete="cc-exp"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailsChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="CVV"
                            name="cc-csc"
                            autoComplete="cc-csc"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                            Next
                        </Button>
                    </Box>
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
