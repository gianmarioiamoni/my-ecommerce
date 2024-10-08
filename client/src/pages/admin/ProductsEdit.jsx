import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
    Container, Grid, Card, CardContent, Typography, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    TextField, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

import { getAllProducts, deleteProduct } from '../../services/productsServices';
import { useTranslation } from 'react-i18next';

const ProductsEdit = () => {
    const { t } = useTranslation();
    const [filteredProducts, setFilteredProducts] = useState([]); // Stores the filtered list of products
    const [open, setOpen] = useState(false); // Indicates whether the delete confirmation dialog is open
    const [productToDelete, setProductToDelete] = useState(null); // Stores the ID of the product to delete
    const [searchQuery, setSearchQuery] = useState(''); // Stores the search query
    const [availabilityFilter, setAvailabilityFilter] = useState(''); // Stores the availability filter

    // Fetch products using useQuery
    const { data: products = [], isLoading, isError, error } = useQuery('products', getAllProducts, {
        onSuccess: (data) => {
            setFilteredProducts(data); // Set initial filtered products
        },
    });

    /**
     * Handles deleting a product.
     * @param {string} productId The ID of the product to delete.
     */
    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            const updatedProducts = products.filter(product => product._id !== productId);
            setFilteredProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Opens the delete confirmation dialog.
     * @param {string} productId The ID of the product to delete.
     */
    const handleClickOpen = (productId) => {
        setProductToDelete(productId);
        setOpen(true);
    };

    /**
     * Closes the delete confirmation dialog.
     */
    const handleClose = () => {
        setOpen(false);
        setProductToDelete(null);
    };

    /**
     * Confirms the deletion of a product.
     */
    const handleConfirmDelete = () => {
        handleDelete(productToDelete);
        handleClose();
    };

    /**
     * Handles changes to the search query.
     * @param {React.ChangeEvent<HTMLInputElement>} event The change event.
     */
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        filterProducts(event.target.value, availabilityFilter);
    };

    /**
     * Handles changes to the availability filter.
     * @param {React.ChangeEvent<HTMLSelectElement>} event The change event.
     */
    const handleAvailabilityChange = (event) => {
        setAvailabilityFilter(event.target.value);
        filterProducts(searchQuery, event.target.value);
    };

    /**
     * Filters the products based on the search query and availability filter.
     * @param {string} search The search query.
     * @param {string} availability The availability filter.
     */
    const filterProducts = (search, availability) => {
        const lowercasedSearch = search.toLowerCase();

        const filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(lowercasedSearch) ||
                product.description.toLowerCase().includes(lowercasedSearch);

            const matchesAvailability = availability ? product.availability === availability : true;

            return matchesSearch && matchesAvailability;
        });

        setFilteredProducts(filtered);
    };

    if (isLoading) {
        return <div>{t('productsEdit.loading')}</div>;
    }

    if (isError) {
        return <div>{t('productsEdit.error')} {error.message}</div>;
    }

    return (
        <Container>
            <Typography variant="h4" marginTop={5} gutterBottom>
                {t('productsEdit.title')}
            </Typography>

            {/* Search and Filter Section */}
            <Box mb={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <TextField
                    variant="outlined"
                    placeholder={t('productsEdit.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                    sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { xs: '100%', md: '50%' } }}
                />
                <FormControl variant="outlined" fullWidth sx={{ width: { xs: '100%', md: '30%' } }}>
                    <InputLabel>{t('productsEdit.filterByAvailability')}</InputLabel>
                    <Select
                        value={availabilityFilter}
                        onChange={handleAvailabilityChange}
                        label={t('productsEdit.filterByAvailability')}
                    >
                        <MenuItem value=""><em>{t('productsEdit.availabilityOptions.all')}</em></MenuItem>
                        <MenuItem value="In Stock">{t('productsEdit.availabilityOptions.inStock')}</MenuItem>
                        <MenuItem value="Out of Stock">{t('productsEdit.availabilityOptions.outOfStock')}</MenuItem>
                        <MenuItem value="Pre-order">{t('productsEdit.availabilityOptions.preOrder')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Products List */}
            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item key={product._id} xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6" sx={{ my: 1 }}>
                                    ${product.price}
                                </Typography>
                                {product.availability === 'In Stock' && (
                                    <Typography
                                        variant="subtitle1"
                                        color={product.quantity === 0 ? 'error' : 'textPrimary'}
                                        gutterBottom
                                    >
                                        {product.quantity === 0 ? t('productsEdit.outOfStock') : `Quantity: ${product.quantity}`}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {t('productsEdit.availability')}: {product.availability}
                                </Typography>
                                <Box display="flex" justifyContent="space-between">
                                    <IconButton component={Link} to={`/products/edit/${product._id}`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleClickOpen(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('productsEdit.confirmDeleteTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('productsEdit.confirmDeleteMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t('productsEdit.cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        {t('productsEdit.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsEdit;

