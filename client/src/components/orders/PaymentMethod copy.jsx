import React, { useState } from 'react';
import { Container, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';

import { useTranslation } from 'react-i18next';

const PaymentMethod = ({ nextStep, prevStep }) => {
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleNext = () => {
        nextStep(selectedMethod);
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Choose Payment Method
                </Typography>

                <FormControl component="fieldset" fullWidth margin="normal">
                    <FormLabel component="legend" style={{ textAlign: 'center' }}>Payment Method</FormLabel>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <RadioGroup
                            aria-label="payment-method"
                            name="payment-method"
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            style={{ textAlign: 'center' }}
                        >
                            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                            <FormControlLabel value="credit-card" control={<Radio />} label="Credit Card" />
                        </RadioGroup>
                    </Box>
                </FormControl>

                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" color="secondary" onClick={prevStep}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!selectedMethod}
                        style={{ marginLeft: '10px' }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PaymentMethod;



