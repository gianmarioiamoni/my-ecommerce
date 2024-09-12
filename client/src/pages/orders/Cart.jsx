// src/pages/Cart.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Importa useTranslation
import { CartContext } from '../../contexts/CartContext';
import CartItem from '../../components/products/CartItem';

const Cart = () => {
    const { t } = useTranslation(''); // Usa il namespace specificato
    const { cart, clearCart, getTotal, checkQuantities } = useContext(CartContext);
    const [hasErrors, setHasErrors] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkQuantities().then((errors) => {
            setHasErrors(errors);
        });
    }, [cart, checkQuantities]);

    const handleCheckout = () => {
        checkQuantities().then((errors) => {
            if (!errors) {
                navigate('/checkout');
            } else {
                alert(t('cart.quantityErrorAlert')); // Usa la funzione t per le etichette
            }
        });
    };

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    {t('cart.cartTitle')} {/* Usa la funzione t per il titolo */}
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {cart.length === 0 ? (
                        <Typography variant="h6" align="center" gutterBottom>
                            {t('cart.emptyCartMessage')} {/* Usa la funzione t per il messaggio vuoto */}
                        </Typography>
                    ) : (
                        cart.map(product => (
                            <Grid item key={product._id} xs={12}>
                                <CartItem product={product} />
                                {product.maxQuantityError && (
                                    <Typography color="error" variant="body2">
                                        {t('cart.maxQuantityError2', { name: product.name, quantity: product.availableQuantity })} {/* Usa la funzione t per l'errore di quantità */}
                                    </Typography>
                                )}
                            </Grid>
                        ))
                    )}
                </Grid>
                {cart.length > 0 && (
                    <>
                        <Typography variant="h5" align="center" sx={{ marginTop: 3 }}>
                            {t('cart.totalLabel', { total: getTotal() })} {/* Usa la funzione t per l'etichetta totale */}
                        </Typography>
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button
                                onClick={clearCart}
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 2 }}
                            >
                                {t('cart.clearCartButton')} {/* Usa la funzione t per il pulsante di svuotamento carrello */}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCheckout}
                                disabled={hasErrors}
                            >
                                {t('cart.checkoutButton')} {/* Usa la funzione t per il pulsante di checkout */}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Cart;






