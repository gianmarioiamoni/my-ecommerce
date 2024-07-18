import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

const ShippingForm = ({ nextStep }) => {
    const [shippingData, setShippingData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingData({
            ...shippingData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass shipping data to the next step
        nextStep(shippingData);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Shipping Details
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    value={shippingData.fullName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    margin="normal"
                    value={shippingData.address}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="city"
                    label="City"
                    fullWidth
                    margin="normal"
                    value={shippingData.city}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="postalCode"
                    label="Postal Code"
                    fullWidth
                    margin="normal"
                    value={shippingData.postalCode}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="country"
                    label="Country"
                    fullWidth
                    margin="normal"
                    value={shippingData.country}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Next
                </Button>
            </form>
        </Container>
    );
};

export default ShippingForm;
