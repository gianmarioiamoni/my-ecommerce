import React from 'react';
import { Button } from '@mui/material';

import { useTranslation } from 'react-i18next';

/**
 * @function AddToCartButton
 * @description A button component that shows the corresponding button text based on the given props.
 * @param {boolean} isInCart If the item is already in the cart.
 * @param {function} addToCart A function to add the item to the cart.
 * @param {function} removeFromCart A function to remove the item from the cart.
 * @param {boolean} isDisabled If the button should be disabled.
 * @returns A button component with the correct text and onClick handler.
 */
const AddToCartButton = ({ isInCart, addToCart, removeFromCart, isDisabled }) => {

    const { t, i18n } = useTranslation();

    /**
     * Returns the correct button based on the given props.
     * If the item is already in the cart, the button shows the text "Remove from Cart".
     * Otherwise, it shows the text "Add to Cart".
     */
    return isInCart ? (
        <Button size="small" color="secondary" onClick={removeFromCart}>
            {/* Remove from Cart */}
            {t('cart.removeFromCart')}
        </Button>
    ) : (
        <Button
            size="small"
            color="primary"
            onClick={addToCart}
            disabled={isDisabled}
        >
            {t('cart.addToCart')}
        </Button>
    );
};

export default AddToCartButton;

