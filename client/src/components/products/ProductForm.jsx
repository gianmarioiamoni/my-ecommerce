import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { createProduct } from '../../services/productsServices';

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrls: [] });
    const [localImages, setLocalImages] = useState([]);
    const [url, setUrl] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Controlla se i campi obbligatori sono compilati
        const isNameValid = formData.name.trim() !== '';
        const isDescriptionValid = formData.description.trim() !== '';
        const isPriceValid = formData.price.trim() !== '';
        const isImageUrlsValid = formData.imageUrls.some(url => url.trim() !== '') || localImages.length > 0;

        setIsFormValid(isNameValid && isDescriptionValid && isPriceValid && isImageUrlsValid);
    }, [formData, localImages]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUrlChange = (index, e) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = e.target.value;
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleAddUrl = () => {
        if (url.trim() !== '') {
            setFormData({ ...formData, imageUrls: [...formData.imageUrls, url] });
            setUrl('');
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newLocalImages = files.map(file => URL.createObjectURL(file));
        setLocalImages([...localImages, ...newLocalImages]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const allImages = [...formData.imageUrls, ...localImages];
            const newProduct = await createProduct({ ...formData, imageUrls: allImages });
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="New Image URL"
                            value={url}
                            onChange={handleUrlChange}
                            fullWidth
                        />
                        <Button type="button" variant="outlined" onClick={handleAddUrl}>
                            Add Image URL
                        </Button>
                    </Box>
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                        Upload Local Images
                        <input type="file" multiple hidden onChange={handleFileChange} />
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        {formData.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Product ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        ))}
                        {localImages.map((src, index) => (
                            <img key={index} src={src} alt={`Product Local ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        ))}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
                        Add Product
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductForm;

