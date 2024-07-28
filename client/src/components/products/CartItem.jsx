import React, { useContext } from 'react';
import { Button, Card, CardContent, Typography, TextField, Grid } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ product }) => {
    const { updateQuantity, removeFromCart } = useContext(CartContext);

    const handleQuantityChange = (event) => {
        const quantity = parseInt(event.target.value, 10);
        if (quantity > 0) {
            updateQuantity(product._id, quantity);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="h6">${product.price}</Typography>
                <TextField
                    label="Quantity"
                    type="number"
                    value={product.quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                />
                <Button onClick={() => removeFromCart(product._id)} variant="contained" color="secondary">
                    Remove from Cart
                </Button>
            </CardContent>
        </Card>
    );
};

export default CartItem;


