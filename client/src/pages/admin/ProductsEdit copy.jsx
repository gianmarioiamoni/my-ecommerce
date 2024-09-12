import React, { useState, useEffect } from 'react';
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

const ProductsEdit = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            const updatedProducts = products.filter(product => product._id !== productId);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickOpen = (productId) => {
        setProductToDelete(productId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = () => {
        handleDelete(productToDelete);
        handleClose();
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        filterProducts(event.target.value, availabilityFilter);
    };

    const handleAvailabilityChange = (event) => {
        setAvailabilityFilter(event.target.value);
        filterProducts(searchQuery, event.target.value);
    };

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

    return (
        <Container>
            <Typography variant="h4" marginTop={5} gutterBottom>
                Edit Products
            </Typography>

            {/* Search and Filter Section */}
            <Box mb={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <TextField
                    variant="outlined"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                    sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { xs: '100%', md: '50%' } }}
                />
                <FormControl variant="outlined" fullWidth sx={{ width: { xs: '100%', md: '30%' } }}>
                    <InputLabel>Filter by Availability</InputLabel>
                    <Select
                        value={availabilityFilter}
                        onChange={handleAvailabilityChange}
                        label="Filter by Availability"
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="In Stock">In Stock</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                        <MenuItem value="Pre-order">Pre-order</MenuItem>
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
                                        {product.quantity === 0 ? 'Out of stock' : `Quantity: ${product.quantity}`}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Availability: {product.availability}
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
                <DialogTitle>{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductsEdit;

