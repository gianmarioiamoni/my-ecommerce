import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Container, Box } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';
import CartItem from '../../components/products/CartItem';

const Cart = () => {
    const { cart, clearCart, getTotal, checkQuantities, hasErrors } = useContext(CartContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (hasErrors !== null) {
    //         if (!hasErrors) {
    //             console.log('All quantities are within limits, proceeding to checkout');
    //             // Se non ci sono errori, permetti il checkout
    //             // navigazione verso la pagina di checkout
    //             navigate('/checkout');
    //         } else {
    //             console.log('Some items have exceeded their available quantities');
    //             // Se ci sono errori, mostra un messaggio o blocca il processo
    //             alert('Some items have exceeded their available quantities.');
    //         }
    //     }
    // }, [hasErrors, navigate]);
    const handleCheckout = () => {
        console.log('Checkout button clicked');
        // checkQuantities((hasErrors)); // Controlla le quantità prima del checkout
        // console.log('hasErrors', hasErrors);
        // if (!hasErrors) {
        //     console.log('All quantities are within limits, proceeding to checkout');
        //     // Se non ci sono errori, permetti il checkout
        //     // navigazione verso la pagina di checkout
        //     navigate('/checkout');
        // } else {
        //     console.log('Some items have exceeded their available quantities');
        //     // Se ci sono errori, mostra un messaggio o blocca il processo
        //     alert('Some items have exceeded their available quantities.');
        // }
        checkQuantities().then((hasErrors) => {
            if (!hasErrors) {
                console.log('All quantities are within limits, proceeding to checkout');
                // Se non ci sono errori, permetti il checkout
                // navigazione verso la pagina di checkout
                navigate('/checkout');
            } else {
                console.log('Some items have exceeded their available quantities');
                // Se ci sono errori, mostra un messaggio o blocca il processo
                alert('Some items have exceeded their available quantities.');
            }
        });
    };
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
                                {product.maxQuantityError && (
                                    <Typography color="error" variant="body2">
                                        The maximum available quantity for {product.name} is {product.availableQuantity}.
                                    </Typography>
                                )}
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
                                onClick={handleCheckout}
                                disabled={hasErrors} // Disabilita il pulsante se ci sono errori
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




