import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button, Container, Box } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/products/CartItem';

const Cart = () => {
    const { cart, clearCart, getTotal } = useContext(CartContext);

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Your Cart
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {cart.length === 0 ? (
                        <Typography variant="h6" align="center" gutterBottom>
                            Your cart is empty
                        </Typography>
                    ) : (
                        cart.map(product => (
                            <Grid item key={product._id} xs={12}>
                                <CartItem product={product} />
                            </Grid>
                        ))
                    )}
                </Grid>
                {cart.length > 0 && (
                    <>
                        <Typography variant="h5" align="center" sx={{ marginTop: 3 }}>
                            Total: ${getTotal()}
                        </Typography>
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button
                                onClick={clearCart}
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 2 }}
                            >
                                Clear Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to="/checkout"
                            >
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Cart;



