import React from 'react';
import { Container, Typography } from '@mui/material';

const Success = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Order Successful
            </Typography>
            <Typography variant="body1">
                Thank you for your purchase! Your order has been placed successfully.
            </Typography>
        </Container>
    );
};

export default Success;
