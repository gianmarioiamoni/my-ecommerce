import React, { useState, useContext} from "react";
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../contexts/AuthContext';

import {
    Grid,
    TextField,
    Button,
    Box
} from "@mui/material";

import { addPaymentMethod } from "../../services/usersServices";

const PaymentsForm = ({setPayments}) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const [paymentForm, setPaymentForm] = useState({ // Form data for new payment method
        cardType: '',
        last4Digits: '',
        cardNumber: '',
        expiryDate: '',
    });
    /**
      * Handles addition of new payment method
      * @param {Object} newPayment - New payment method data
      */
    const handleAddPaymentMethod = async (newPayment) => {
        try {
            const cardNumber = newPayment.cardNumber;
            const last4Digits = cardNumber.slice(cardNumber.length - 4);
            newPayment.last4Digits = last4Digits;
            const response = await addPaymentMethod(user.id, newPayment);
            // setPayments([...payments, response]);
            setPayments((prev) => [...prev, response]);
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.addPaymentError'), error);
        }
    };

    /**
     * Handles change of payment form data
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
     */
    const handlePaymentChange = (e) => {
        // setPaymentForm({
        //     ...paymentForm,
        //     [e.target.name]: e.target.value
        // });
        setPaymentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                handleAddPaymentMethod(paymentForm);
                setPaymentForm({
                    cardType: '',
                    last4Digits: '',
                    cardNumber: '',
                    expiryDate: '',
                });
            }}
            sx={{ mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={t('manageAddressesPayments.fields.cardType')}
                        name="cardType"
                        value={paymentForm.cardType}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={t('manageAddressesPayments.fields.cardNumber')}
                        name="cardNumber"
                        value={paymentForm.cardNumber}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={t('manageAddressesPayments.fields.expiryDate')}
                        name="expiryDate"
                        value={paymentForm.expiryDate}
                        onChange={handlePaymentChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {t('manageAddressesPayments.buttons.addPayment')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
};

export default PaymentsForm;