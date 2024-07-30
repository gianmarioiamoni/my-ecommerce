import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, IconButton, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProductById, updateProduct, uploadImage } from '../../services/productsServices';
import { useCategories } from '../../contexts/CategoriesContext';

const EditProductForm = () => {
    const { id } = useParams();
    const { categories } = useCategories();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrls: [],
        availability: 'In Stock',
        category: ''
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
                    category: product.category || ''
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

            setIsUploading(true); // Inizia il caricamento
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
            setIsUploading(false); // Termina il caricamento
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
        <Container>
            <Typography variant="h4" gutterBottom>
                Edit Product
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="availability-label">Availability*</InputLabel>
                    <Select
                        labelId="availability-label"
                        name="availability"
                        value={product.availability}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="In Stock">In Stock</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                        <MenuItem value="Pre-order">Pre-order</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category"
                        value={product.category || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="h6" gutterBottom>
                    Images
                </Typography>
                {product.imageUrls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img src={url} alt={`Product ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                        <TextField
                            label={`Image URL ${index + 1}`}
                            value={url}
                            onChange={(e) => handleImageChange(e, index)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)}
                            style={{ marginLeft: '10px' }}
                        />
                        <IconButton onClick={() => handleRemoveImage(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <Button onClick={handleAddImage} variant="outlined" color="primary" style={{ marginBottom: '20px', display: 'block' }}>
                    Add Image
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={!isFormValid || isUploading} style={{ marginTop: '10px' }}>
                    {isUploading ? 'Loading Image...' : 'Save Changes'}
                </Button>
            </form>
            <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                    Product updated successfully!
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

export default EditProductForm;







