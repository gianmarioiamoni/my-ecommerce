import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/products', formData);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add a New Product
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField name="name" label="Name" onChange={handleChange} fullWidth />
                <TextField name="description" label="Description" onChange={handleChange} fullWidth />
                <TextField name="price" label="Price" type="number" onChange={handleChange} fullWidth />
                <TextField name="imageUrl" label="Image URL" onChange={handleChange} fullWidth />
                <Button type="submit" variant="contained" color="primary">
                    Add Product
                </Button>
            </Box>
        </Container>
    );
};

export default ProductForm;

