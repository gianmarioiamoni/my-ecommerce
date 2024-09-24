import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createProduct, uploadImage } from '../../services/productsServices';
import { useCategories } from '../../contexts/CategoriesContext';
import { useTranslation } from 'react-i18next';

/**
 * The AddNewProduct component is a form to add a new product to the store.
 * The form includes fields for the product name, description, price, image URLs,
 * availability, quantity and category.
 * The component also includes a button to add local images and a button to submit the form.
 * The component uses the createProduct service to create a new product.
 * The component also uses the uploadImage service to upload images.
 * The component also uses the useCategories hook to get the categories.
 * The component also uses the useTranslation hook to get the translations.
 * @returns {JSX.Element} The AddNewProduct component
 */
const AddNewProduct = () => {
    const { t } = useTranslation();

    /**
     * The state of the form
     */
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrls: [],
        availability: '',
        category: '',
        quantity: '',
    });

    const [localImages, setLocalImages] = useState([]);
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

    /**
     * The function to handle the change of the form
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * The function to handle the change of the image URLs
     * @param {number} index - The index of the image URL
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleImageUrlChange = (index, e) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = e.target.value;
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    /**
     * The function to handle the change of the URL
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    /**
     * The function to handle the add URL button
     */
    const handleAddUrl = () => {
        if (url.trim() !== '') {
            setFormData({ ...formData, imageUrls: [...formData.imageUrls, url] });
            setUrl('');
        }
    };

    /**
     * The function to handle the file change
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
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

    /**
     * The function to handle the submit of the form
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
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
                    {t('addProduct.title')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        name="name"
                        label={t('addProduct.name')}
                        onChange={handleChange}
                        value={formData.name}
                        fullWidth
                        required
                    />
                    <TextField
                        name="description"
                        label={t('addProduct.description')}
                        onChange={handleChange}
                        value={formData.description}
                        fullWidth
                        required
                    />
                    <TextField
                        name="price"
                        label={t('addProduct.price')}
                        type="number"
                        onChange={handleChange}
                        value={formData.price}
                        fullWidth
                        required
                    />
                    {formData.imageUrls.map((url, index) => (
                        <TextField
                            key={index}
                            label={`${t('addProduct.imageUrl')} ${index + 1}${index === 0 ? '*' : ''}`}
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e)}
                            fullWidth
                            required={index === 0} // only the first image is required
                        />
                    ))}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label={t('addProduct.newImageUrl')}
                            value={url}
                            onChange={handleUrlChange}
                            fullWidth
                        />
                        <Button type="button" variant="outlined" onClick={handleAddUrl}>
                            {t('addProduct.addImageUrl')}
                        </Button>
                    </Box>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                        disabled={isUploading} // disable the button while the image is being uploaded
                    >
                        {isUploading ? t('addProduct.loadingImage') : t('addProduct.uploadLocalImages')}
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
                        <InputLabel id="availability-label">{t('addProduct.availability')}*</InputLabel>
                        <Select
                            labelId="availability-label"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            label={t('addProduct.availability') + '*'}
                            required
                        >
                            <MenuItem value="In Stock">{t('addProduct.inStock')}</MenuItem>
                            <MenuItem value="Out of Stock">{t('addProduct.outOfStock')}</MenuItem>
                            <MenuItem value="Pre-order">{t('addProduct.preOrder')}</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Quantity. Disabled if availability is not "In Stock" */}
                    <TextField
                        name="quantity"
                        label={t('addProduct.quantity')}
                        type="number"
                        onChange={handleChange}
                        value={formData.quantity}
                        fullWidth
                        required
                        disabled={formData.availability !== 'In Stock'} // Disabilita se availability non è "In Stock"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="category-label">{t('addProduct.category')}</InputLabel>
                        <Select
                            labelId="category-label"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            label={t('addProduct.category')}
                        >
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
                        {t('addProduct.addProduct')}
                    </Button>
                </Box>
            </Paper>
            <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                    {t('addProduct.successMessage')}
                </Alert>
            </Snackbar>
            <Snackbar open={errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage(false)}>
                <Alert onClose={() => setErrorMessage(false)} severity="error" sx={{ width: '100%' }}>
                    {t('addProduct.errorMessage')}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddNewProduct;

