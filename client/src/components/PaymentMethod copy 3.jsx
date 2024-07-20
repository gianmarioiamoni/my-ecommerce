import React, { useState, useEffect, useRef } from 'react';
import { Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';

const PaymentMethod = ({ nextStep, prevStep, getTotal, handlePaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // Default to PayPal for demonstration
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const paypalContainerRef = useRef(null);

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value !== 'paypal') {
            setPaypalLoaded(false); // Reset PayPal loaded state
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep(paymentMethod);
    };

    useEffect(() => {
        const loadPaypalButtons = () => {
            if (paypalContainerRef.current) {
                paypalContainerRef.current.innerHTML = ''; // Clear previous buttons
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    // value: '0.01'
                                    value: getTotal()
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        // return actions.order.capture().then(details => {
                        //     console.log('Payment Approved: ', details);
                        //     console.log('Calling nextStep function...');
                        //     nextStep(paymentMethod); 
                        // });
                        return actions.order.capture().then(details => {
                            console.log('Payment Approved: ', details);
                            handlePaymentSuccess(details); 
                        });
                    },
                    onError: (err) => {
                        console.error('Error: ', err);
                    }
                }).render(paypalContainerRef.current);
            }
        };

        if (paymentMethod === 'paypal' && !paypalLoaded) {
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


