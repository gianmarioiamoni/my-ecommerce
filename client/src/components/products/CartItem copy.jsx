import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, Typography, TextField, Box } from '@mui/material';

import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';


/**
 * The CartItem component renders a single item in the cart, including its quantity,
 * price and a button to remove it.
 *
 * @param {Object} product - The product object, including its id, name, description,
 * price, availableQuantity and quantity in the cart.
 * @returns {JSX.Element} The CartItem component
 */
const CartItem = ({ product }) => {
    const { updateQuantity, removeFromCart } = useContext(CartContext);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    /**
     * Handles the quantity change event, updating the quantity of the product in the cart
     * and setting an error if the quantity is higher than the available quantity.
     * @param {Object} event - The event object
     */
    const handleQuantityChange = (event) => {
        const quantity = parseInt(event.target.value, 10);
        if (quantity > 0) {
            if (quantity > product.availableQuantity) {
                setError(true);
            } else {
                setError(false);
                updateQuantity(product._id, quantity);
            }
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
                        value={product.quantity}
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




