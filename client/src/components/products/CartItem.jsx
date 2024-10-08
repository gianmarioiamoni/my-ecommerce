import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Typography, TextField, Box } from '@mui/material';

import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

const CartItem = ({ product }) => {
    const { updateQuantity, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    // State to handle the current quantity
    const [quantity, setQuantity] = useState(product.quantity);
    const [error, setError] = useState(false);

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);

        if (isNaN(newQuantity) || newQuantity <= 0) {
            // Prevent negative or invalid input
            setQuantity('');
            return;
        }

        // Check if the quantity exceeds the available stock
        if (newQuantity > product.availableQuantity) {
            setError(true);
        } else {
            setError(false);
            setQuantity(newQuantity);
            updateQuantity(product._id, newQuantity, user);
        }
    };

    return (
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        label={t('cart.quantity')}
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1 }}
                        error={error}
                        helperText={error ? t('cart.maxQuantityError', { max: product.availableQuantity }) : ''}
                        sx={{ width: '100px', marginRight: 2 }}
                    />
                    <Button
                        onClick={() => removeFromCart(product._id, user)}
                        variant="contained"
                        color="secondary"
                    >
                        {t('cart.remove')}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartItem;





