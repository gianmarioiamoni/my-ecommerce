import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button, Container } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/products/CartItem';

const Cart = () => {
    const { cart, clearCart, getTotal } = useContext(CartContext);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Cart
            </Typography>
            <Grid container spacing={4}>
                {cart.map(product => (
                    <Grid item key={product._id} xs={12}>
                        <CartItem product={product} />
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" sx={{ marginTop: 2 }}>
                Total: ${getTotal()}
            </Typography>
            <Button onClick={clearCart} variant="contained" color="primary">
                Clear Cart
            </Button>
            <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/checkout">
                Proceed to Checkout
            </Button>
        </Container>
    );
};

export default Cart;


