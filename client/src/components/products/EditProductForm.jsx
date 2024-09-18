import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, IconButton, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Grid, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProductById, updateProduct, uploadImage } from '../../services/productsServices';
import { useCategories } from '../../contexts/CategoriesContext';
import { useTranslation } from 'react-i18next'; // Importa useTranslation

const EditProductForm = () => {
    const { t } = useTranslation(); // Usa useTranslation
    const { id } = useParams();
    const { categories } = useCategories();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrls: [],
        availability: 'In Stock',
        category: '',
        quantity: 0
    });
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                setProduct(prevProduct => ({
                    ...prevProduct,
                    ...product,
                    availability: product.availability || 'In Stock',
                    category: product.category || '',
                    quantity: product.quantity || 0
                }));
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const isNameValid = product.name.trim() !== '';
        const isDescriptionValid = product.description.trim() !== '';
        const isPriceValid = product.price !== '' && !isNaN(product.price);
        const isImageUrlsValid = product.imageUrls.some(url => url.trim() !== '');
        const isAvailabilityValid = product.availability.trim() !== '';

        setIsFormValid(isNameValid && isDescriptionValid && isPriceValid && isImageUrlsValid && isAvailabilityValid);
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleImageChange = (e, index) => {
        const newImageUrls = [...product.imageUrls];
        newImageUrls[index] = e.target.value;
        setProduct((prevProduct) => ({
            ...prevProduct,
            imageUrls: newImageUrls
        }));
    };

    const handleFileChange = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setIsUploading(true); // start uploading
            try {
                const data = await uploadImage(formData);
                const newImageUrls = [...product.imageUrls];
                newImageUrls[index] = data.url;
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    imageUrls: newImageUrls
                }));
            } catch (error) {
                console.error(error);
                setErrorMessage(true);
                setTimeout(() => {
                    setErrorMessage(false);
                }, 3000);
            }
            setIsUploading(false); // end uploading
        }
    };

    const handleAddImage = () => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            imageUrls: [...prevProduct.imageUrls, '']
        }));
    };

    const handleRemoveImage = (index) => {
        const newImageUrls = product.imageUrls.filter((_, i) => i !== index);
        setProduct((prevProduct) => ({
            ...prevProduct,
            imageUrls: newImageUrls
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, product);
            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                {t('editProduct.editProduct')}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t('editProduct.name')}
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ bgcolor: '#f9f9f9' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t('editProduct.price')}
                            name="price"
                            type="number"
                            value={product.price}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ bgcolor: '#f9f9f9' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label={t('editProduct.description')}
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ bgcolor: '#f9f9f9' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel id="availability-label">{t('editProduct.availability')}*</InputLabel>
                            <Select
                                labelId="availability-label"
                                name="availability"
                                value={product.availability}
                                onChange={handleChange}
                                required
                                sx={{ bgcolor: '#f9f9f9' }}
                            >
                                <MenuItem value="In Stock">{t('editProduct.inStock')}</MenuItem>
                                <MenuItem value="Out of Stock">{t('editProduct.outOfStock')}</MenuItem>
                                <MenuItem value="Pre-order">{t('editProduct.preOrder')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel id="category-label">{t('editProduct.category')}</InputLabel>
                            <Select
                                labelId="category-label"
                                name="category"
                                value={product.category || ''}
                                onChange={handleChange}
                                required
                                sx={{ bgcolor: '#f9f9f9' }}
                            >
                                {categories.map((category, index) => (
                                    <MenuItem key={index} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label={t('editProduct.quantity')}
                            name="quantity"
                            type="number"
                            value={product.quantity}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{ bgcolor: '#f9f9f9' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            {product.imageUrls.map((url, index) => (
                                <Box key={index} mb={2} display="flex" alignItems="center">
                                    <TextField
                                        label={t('editProduct.images')}
                                        value={url}
                                        onChange={(e) => handleImageChange(e, index)}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        sx={{ bgcolor: '#f9f9f9' }}
                                    />
                                    <Button
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 2 }}
                                    >
                                        {t('editProduct.loadImage')}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleFileChange(e, index)}
                                        />
                                    </Button>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleRemoveImage(index)}
                                        sx={{ ml: 2 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleAddImage}
                                sx={{ mb: 2 }}
                            >
                                {t('editProduct.addImage')}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isFormValid || isUploading}
                        >
                            {t('editProduct.saveChanges')}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={successMessage} autoHideDuration={3000}>
                <Alert severity="success">{t('editProduct.successMessage')}</Alert>
            </Snackbar>
            <Snackbar open={errorMessage} autoHideDuration={3000}>
                <Alert severity="error">{t('editProduct.errorMessage')}</Alert>
            </Snackbar>
        </Container>
    );
};

export default EditProductForm;









