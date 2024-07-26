import React, { useContext, useState, useEffect } from 'react';

import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

import { CartContext } from '../../contexts/CartContext';
import PayPalButton from './PayPalButton';
import CreditCardForm from './CreditCardForm';

const ReviewOrder = ({ shippingData, paymentMethod, prevStep, placeOrder }) => {
    const { cart } = useContext(CartContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(cart.reduce((total, product) => total + product.price, 0).toFixed(2));
    }, [cart]);


    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Review Your Order
            </Typography>
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
            <Typography variant="body1">{paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}</Typography>
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
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="secondary" onClick={prevStep}>
                    Back
                </Button>
                {paymentMethod === 'paypal' ? (
                    <PayPalButton
                        amount={total}
                        onSuccess={placeOrder} />
                ) : (
                    <CreditCardForm
                        handlePaymentSuccess={placeOrder}
                        total={total} />
                )}
            </div>
        </Container>
    );
};

export default ReviewOrder;




