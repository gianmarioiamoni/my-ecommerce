import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createProduct, uploadImage } from '../../services/productsServices';
import { useCategories } from '../../contexts/CategoriesContext';

const AddNewProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrls: [],
        availability: '',
        category: '',
        quantity: ''  // Aggiunto il campo quantity
    });
    const [localImages] = useState([]);
    const [url, setUrl] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { categories } = useCategories();

    const navigate = useNavigate();

    useEffect(() => {
        const isNameValid = formData.name.trim() !== '';
        const isDescriptionValid = formData.description.trim() !== '';
        const isPriceValid = formData.price.trim() !== '';
        const isImageUrlsValid = formData.imageUrls.some(url => url.trim() !== '') || localImages.length > 0;
        const isAvailabilityValid = formData.availability.trim() !== '';

        setIsFormValid(isNameValid && isDescriptionValid && isPriceValid && isImageUrlsValid && isAvailabilityValid);
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
        setIsUploading(true);
        for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const data = await uploadImage(formData);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrls: [...prevFormData.imageUrls, data.url],
                }));
            } catch (error) {
                console.error('Error uploading file:', error);
                setErrorMessage(true);
                setTimeout(() => {
                    setErrorMessage(false);
                }, 3000);
            }
        }
        setIsUploading(false);
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
                            label={`Image URL ${index + 1}${index === 0 ? '*' : ''}`}
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
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                        disabled={isUploading} // disable the button while the image is being uploaded
                    >
                        {isUploading ? 'Loading Image...' : 'Upload Local Images'}
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
                    <FormControl fullWidth>
                        <InputLabel id="availability-label">Availability*</InputLabel>
                        <Select
                            labelId="availability-label"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            label="Availability*"
                            required
                        >
                            <MenuItem value="In Stock">In Stock</MenuItem>
                            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                            <MenuItem value="Pre-order">Pre-order</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Campo per la quantità */}
                    <TextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        onChange={handleChange}
                        value={formData.quantity}
                        fullWidth
                        required
                        disabled={formData.availability !== 'In Stock'} // Disabilita se availability non è "In Stock"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            label="Category"
                        >
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

export default AddNewProduct;
