import React, { useContext, useState, useEffect } from 'react';

import { Container, Typography, Button, List, ListItem, ListItemText, Grid, Box } from '@mui/material';

import { CartContext } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

import PayPalButton from './PayPalButton';
import CreditCardForm from './CreditCardForm';

/**
 * Renders the review order page.
 * 
 * This page allows the user to review the order before submitting it.
 * The user can go back to the previous page or proceed to payment.
 * 
 * @param {Object} shippingData
 * @param {String} paymentMethod
 * @param {Function} prevStep
 * @param {Function} placeOrder
 * @param {String} userId
 * @returns {ReactElement}
 */
const ReviewOrder = ({ shippingData, paymentMethod, prevStep, placeOrder, userId }) => {
    const { cart } = useContext(CartContext);
    const { t } = useTranslation();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2));
    }, [cart]);

    return (
        <Container maxWidth="lg" style={{ marginTop: '40px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('reviewOrder.title')}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {/* Column 1 - Order Review */}
                <Grid item xs={12} md={6}>
                    <Box style={{ padding: '20px', minHeight: '300px' }}>
                        {/* Shipping Details */}
                        <Typography variant="h6" gutterBottom fontWeight={'bold'}>
                            {t('reviewOrder.shippingDetails')}
                        </Typography>
                        <Typography variant="body1">{shippingData.fullName}</Typography>
                        <Typography variant="body1">{shippingData.address}</Typography>
                        <Typography variant="body1">
                            {shippingData.city}, {shippingData.postalCode}, {shippingData.country}
                        </Typography>

                        {/* Payment Method */}
                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            {t('reviewOrder.paymentMethod')}
                        </Typography>
                        <Typography variant="body1">
                            {paymentMethod === 'paypal' ? t('reviewOrder.paypal') : t('reviewOrder.creditCard')}
                        </Typography>

                        {/* Order Items */}
                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            {t('reviewOrder.orderItems')}
                        </Typography>
                        <List>
                            {cart.map((product) => (
                                <ListItem key={product._id}>
                                    <ListItemText primary={product.name} secondary={`$${product.price}`} />
                                </ListItem>
                            ))}
                        </List>

                        {/* Total */}
                        <Typography variant="h6" gutterBottom>
                            {t('reviewOrder.total')}: ${total}
                        </Typography>

                        {/* Back button */}
                        <Button variant="contained" color="secondary" onClick={prevStep} style={{ marginTop: '20px' }}>
                            {t('reviewOrder.back')}
                        </Button>
                    </Box>
                </Grid>

                {/* Column 2 - Payment */}
                <Grid item xs={12} md={6}>
                    <Box style={{ padding: '20px', minHeight: '300px' }}>
                        {/* Proceed to Payment */}
                        <Typography variant="h6" gutterBottom fontWeight={"bold"}>
                            {t('reviewOrder.proceedToPayment')}
                        </Typography>
                        {paymentMethod === 'paypal' ? (
                            <PayPalButton
                                amount={total}
                                onSuccess={placeOrder} />
                        ) : (
                            <CreditCardForm
                                handlePaymentSuccess={placeOrder}
                                total={total}
                                userId={userId}
                            />
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReviewOrder;




