import React, { useContext } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import PayPalButton from './PayPalButton';

const ReviewOrder = ({ shippingData, paymentMethod, prevStep, placeOrder }) => {
    const { cart } = useContext(CartContext);

    const getTotal = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    const handlePlaceOrder = () => {
        if (paymentMethod !== 'paypal') {
            placeOrder();
        }
    };

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
                Total: ${getTotal()}
            </Typography>
            <div style={{ marginTop: '20px' }}>
                <Button variant="contained" color="secondary" onClick={prevStep}>
                    Back
                </Button>
                {paymentMethod !== 'paypal' && (
                    <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                )}
                {paymentMethod === 'paypal' && (
                    <PayPalButton
                        amount={getTotal()}
                        onSuccess={placeOrder}
                    />
                )}
            </div>
        </Container>
    );
};

export default ReviewOrder;

