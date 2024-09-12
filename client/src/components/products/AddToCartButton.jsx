import React from 'react';
import { Button } from '@mui/material';

import { useTranslation } from 'react-i18next';

const AddToCartButton = ({ isInCart, addToCart, removeFromCart, isDisabled }) => {

    const { t, i18n } = useTranslation();

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

