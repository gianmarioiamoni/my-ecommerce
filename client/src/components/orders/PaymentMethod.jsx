import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';

/**
 * This component renders a page for the user to choose a payment method.
 *
 * The user is presented with a radio button group to select either PayPal or Credit Card.
 * The chosen payment method is stored in the component's state and passed to the next page
 * via the `nextStep` prop.
 *
 * @param {function} nextStep - a function that takes the chosen payment method as an argument
 * @param {function} prevStep - a function that takes the user back to the previous page
 * @returns {ReactElement}
 */
const PaymentMethod = ({ nextStep, prevStep }) => {
    const { t } = useTranslation(); 
    const [selectedMethod, setSelectedMethod] = useState(''); // Stores the chosen payment method

    /**
     * This function handles the next step of the checkout process.
     * It calls the `nextStep` prop with the chosen payment method as an argument.
     */
    const handleNext = () => {
        nextStep(selectedMethod);
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    {t('payment.choosePaymentMethod')}
                </Typography>

                <FormControl component="fieldset" fullWidth margin="normal">
                    <FormLabel component="legend" style={{ textAlign: 'center' }}>
                        {t('payment.paymentMethod')}
                    </FormLabel>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <RadioGroup
                            aria-label="payment-method"
                            name="payment-method"
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            style={{ textAlign: 'center' }}
                        >
                            <FormControlLabel value="paypal" control={<Radio />} label={t('payment.paypal')} />
                            <FormControlLabel value="credit-card" control={<Radio />} label={t('payment.creditCard')} />
                        </RadioGroup>
                    </Box>
                </FormControl>

                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" color="secondary" onClick={prevStep}>
                        {t('back')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!selectedMethod}
                        style={{ marginLeft: '10px' }}
                    >
                        {t('next')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PaymentMethod;




