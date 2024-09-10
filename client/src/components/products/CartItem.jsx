import React, { useContext, useState } from 'react';
import { Button, Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';

const CartItem = ({ product }) => {
    const { updateQuantity, removeFromCart } = useContext(CartContext);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext);

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
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1 }}
                        error={error}
                        helperText={error ? `Maximum available quantity is ${product.availableQuantity}` : ''}
                        sx={{ width: '100px', marginRight: 2 }}
                    />
                    <Button
                        onClick={() => removeFromCart(product._id, user)}
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



