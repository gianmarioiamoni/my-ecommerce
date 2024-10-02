// src/pages/Cart.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Importa useTranslation
import { CartContext } from '../../contexts/CartContext';
import CartItem from '../../components/products/CartItem';

/**
 * The Cart component renders the cart with all its items.
 * The component takes care of checking if the quantities of the items in the cart are valid.
 * If the quantities are valid, the component renders a checkout button. If not, it renders an error message.
 * The component also renders a "Clear cart" button.
 */
const Cart = () => {
    const { t } = useTranslation(''); 
    const { cart, clearCart, getTotal, checkQuantities } = useContext(CartContext);
    const [hasErrors, setHasErrors] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Check the quantities of all items in the cart.
         * If the quantities are valid, set the state of the component to false.
         * If not, set the state of the component to true.
         */
        checkQuantities().then((errors) => {
            setHasErrors(errors);
        });
    }, [cart, checkQuantities]);

    /**
     * Handle the checkout process.
     * If there are no errors, navigate to the checkout page.
     * If there are errors, show an error message.
     */
    const handleCheckout = () => {
        checkQuantities().then((errors) => {
            if (!errors) {
                navigate('/checkout');
            } else {
                alert(t('cart.quantityErrorAlert')); // Translate the error message
            }
        });
    };

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    {t('cart.cartTitle')} 
                </Typography>
                {/* Cart Content */}
                <Grid container spacing={3} justifyContent="center">
                    {cart.length === 0 ? (
                        <Typography variant="h6" align="center" gutterBottom>
                            {t('cart.emptyCartMessage')} 
                        </Typography>
                    ) : (
                        cart.map(product => (
                            <Grid item key={product._id} xs={12}>
                                <CartItem product={product} />
                                {product.maxQuantityError && (
                                    <Typography color="error" variant="body2">
                                        {t('cart.maxQuantityError2', {
                                            name: product.name,
                                            quantity: product.availableQuantity,
                                        })} 
                                    </Typography>
                                )}
                            </Grid>
                        ))
                    )}
                </Grid>
                {cart.length > 0 && (
                    <>
                        <Typography variant="h5" align="center" sx={{ marginTop: 3 }}>
                            {t('cart.totalLabel', { total: getTotal() })} 
                        </Typography>
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button
                                onClick={clearCart}
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 2 }}
                            >
                                {t('cart.clearCartButton')} 
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCheckout}
                                disabled={hasErrors}
                            >
                                {t('cart.checkoutButton')} 
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Cart;






