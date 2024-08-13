import React, { useContext, useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, Grid, Box } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';
import PayPalButton from './PayPalButton';
import CreditCardForm from './CreditCardForm';

const ReviewOrder = ({ shippingData, paymentMethod, prevStep, placeOrder, userId }) => {
    const { cart } = useContext(CartContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(cart.reduce((total, product) => total + product.price, 0).toFixed(2));
    }, [cart]);

    return (
        <Container maxWidth="lg" style={{ marginTop: '40px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Review and Payment
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {/* Colonna 1: Revisione Ordine */}
                <Grid item xs={12} md={6}>
                    <Box style={{ padding: '20px', minHeight: '300px' }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Details
                        </Typography>
                        <Typography variant="body1">{shippingData.fullName}</Typography>
                        <Typography variant="body1">{shippingData.address}</Typography>
                        <Typography variant="body1">
                            {shippingData.city}, {shippingData.postalCode}, {shippingData.country}
                        </Typography>
                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            Payment Method
                        </Typography>
                        <Typography variant="body1">
                            {paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}
                        </Typography>
                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            Order Items
                        </Typography>
                        <List>
                            {cart.map((product) => (
                                <ListItem key={product._id}>
                                    <ListItemText primary={product.name} secondary={`$${product.price}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" gutterBottom>
                            Total: ${total}
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={prevStep} style={{ marginTop: '20px' }}>
                            Back
                        </Button>
                    </Box>
                </Grid>

                {/* Colonna 2: Pagamento */}
                <Grid item xs={12} md={6}>
                    <Box style={{ padding: '20px', minHeight: '300px' }}>
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




