import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Typography, Button } from '@mui/material';

const Success = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Payment Successful
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your purchase! Your order has been placed successfully.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Back to Home
            </Button>
        </Container>
    );
};

export default Success;
