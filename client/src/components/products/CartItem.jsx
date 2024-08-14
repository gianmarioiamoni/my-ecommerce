import React, { useContext } from 'react';
import { Button, Card, CardContent, Typography, TextField, Grid, Box } from '@mui/material';
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
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1 }}
                        sx={{ width: '100px', marginRight: 2 }}
                    />
                    <Button
                        onClick={() => removeFromCart(product._id)}
                        variant="contained"
                        color="secondary"
                    >
                        Remove from Cart
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartItem;



