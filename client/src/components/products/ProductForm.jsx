import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, Alert } from '@mui/material';
import { createProduct } from '../../services/productsServices';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrls: [] });
    const [localImages, setLocalImages] = useState([]);
    const [url, setUrl] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if mandatory fields are filled
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

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${serverURL}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrls: [...prevFormData.imageUrls, data.url],
                }));
            } catch (error) {
                console.error(error);
                setErrorMessage(true);
                setTimeout(() => {
                    setErrorMessage(false);
                }, 3000);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProduct = await createProduct(formData);
            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
                navigate('/products');
            }, 3000);
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
                            required={index === 0} // only the first image is required
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
            <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                    Product created successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage(false)}>
                <Alert onClose={() => setErrorMessage(false)} severity="error" sx={{ width: '100%' }}>
                    Error uploading image. Please try again.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductForm;


