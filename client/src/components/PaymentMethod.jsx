import React, { useState } from 'react';
import { Container, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography } from '@mui/material';

const PaymentMethod = ({ nextStep, prevStep }) => {
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass payment method to the next step
        nextStep(paymentMethod);
    };

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
                        {/* Add more payment methods as needed */}
                    </RadioGroup>
                </FormControl>
                <div style={{ marginTop: '20px' }}>
                    <Button variant="contained" color="secondary" onClick={prevStep}>
                        Back
                    </Button>
                    <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                        Next
                    </Button>
                </div>
            </form>
        </Container>
    );
};

export default PaymentMethod;
