import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { createProduct } from '../../services/productsServices';

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrls: [''] });
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Controlla se i campi obbligatori sono compilati
        const isNameValid = formData.name.trim() !== '';
        const isDescriptionValid = formData.description.trim() !== '';
        const isPriceValid = formData.price.trim() !== '';
        const isImageUrlsValid = formData.imageUrls.some(url => url.trim() !== '');

        setIsFormValid(isNameValid && isDescriptionValid && isPriceValid && isImageUrlsValid);
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUrlChange = (index, e) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = e.target.value;
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    const handleAddImageUrl = () => {
        setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("ProductForm - handleSubmit - formData:", formData);
            const newProduct = await createProduct(formData);
            alert(`Product ${newProduct.name} created successfully!`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Add a New Product
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        name="name"
                        label="Name"
                        onChange={handleChange}
                        value={formData.name}
                        fullWidth
                        required
                    />
                    <TextField
                        name="description"
                        label="Description"
                        onChange={handleChange}
                        value={formData.description}
                        fullWidth
                        required
                    />
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        onChange={handleChange}
                        value={formData.price}
                        fullWidth
                        required
                    />
                    {formData.imageUrls.map((url, index) => (
                        <TextField
                            key={index}
                            label={`Image URL ${index + 1}`}
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e)}
                            fullWidth
                            required={index === 0} // Solo il primo campo immagine è obbligatorio
                        />
                    ))}
                    <Button type="button" variant="outlined" onClick={handleAddImageUrl}>
                        Add Another Image URL
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
                        Add Product
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductForm;



