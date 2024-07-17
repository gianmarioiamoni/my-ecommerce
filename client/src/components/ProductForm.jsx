// ProductForm.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
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
            <form onSubmit={handleSubmit}>
                <TextField name="name" label="Name" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="description" label="Description" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="price" label="Price" type="number" onChange={handleChange} fullWidth margin="normal" />
                <TextField name="imageUrl" label="Image URL" onChange={handleChange} fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary">
                    Add Product
                </Button>
            </form>
        </Container>
    );
};

export default ProductForm;

