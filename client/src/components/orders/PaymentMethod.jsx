import React, { useState } from 'react';

import { Container, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const PaymentMethod = ({ nextStep, prevStep }) => {
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleNext = () => {
        nextStep(selectedMethod);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Choose Payment Method
            </Typography>
            <FormControl component="fieldset">
                <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                    aria-label="payment-method"
                    name="payment-method"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                    <FormControlLabel value="credit-card" control={<Radio />} label="Credit Card" />
                </RadioGroup>
            </FormControl>
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={handleNext} disabled={!selectedMethod}>
                    Next
                </Button>
            </div>
        </Container>
    );
};

export default PaymentMethod;

