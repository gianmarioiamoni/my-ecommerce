import React, { useContext } from 'react';

import { Button, Card, CardContent, Typography } from '@mui/material';

import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ product }) => {
    const { dispatch } = useContext(CartContext);

    const removeFromCart = () => {
        dispatch({ type: 'REMOVE_FROM_CART', id: product.id });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="h6">${product.price}</Typography>
                <Button onClick={removeFromCart} variant="contained" color="secondary">
                    Remove from Cart
                </Button>
            </CardContent>
        </Card>
    );
};

export default CartItem;
