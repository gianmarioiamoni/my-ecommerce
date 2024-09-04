import React from 'react';
import { Button } from '@mui/material';

const AddToCartButton = ({ isInCart, addToCart, removeFromCart, isDisabled }) => {

    return isInCart ? (
        <Button size="small" color="secondary" onClick={removeFromCart}>
            Remove from Cart
        </Button>
    ) : (
        <Button
            size="small"
            color="primary"
            onClick={addToCart}
            disabled={isDisabled}
        >
            Add to Cart
        </Button>
    );
};

export default AddToCartButton;

