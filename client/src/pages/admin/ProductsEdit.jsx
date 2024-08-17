import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
    Container, Grid, Card, CardContent, Typography, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    TextField, FormControl, InputLabel, Select, MenuItem, Box, Badge
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
    const [quantityFilter, setQuantityFilter] = useState('');

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
        filterProducts(event.target.value, availabilityFilter, quantityFilter);
    };

    const handleAvailabilityChange = (event) => {
        setAvailabilityFilter(event.target.value);
        filterProducts(searchQuery, event.target.value, quantityFilter);
    };

    const handleQuantityChange = (event) => {
        setQuantityFilter(event.target.value);
        filterProducts(searchQuery, availabilityFilter, event.target.value);
    };

    const filterProducts = (search, availability, quantity) => {
        const lowercasedSearch = search.toLowerCase();

        const filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(lowercasedSearch) ||
                product.description.toLowerCase().includes(lowercasedSearch);

            const matchesAvailability = availability ? product.availability === availability : true;
            const matchesQuantity = quantity ? product.quantity === parseInt(quantity) : true;

            return matchesSearch && matchesAvailability && matchesQuantity;
        });

        setFilteredProducts(filtered);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Edit Products
            </Typography>

            {/* Search and Filter Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <TextField
                    label="Search by Name or Description"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                    fullWidth
                    sx={{ mr: 2 }}
                />
                <FormControl variant="outlined" sx={{ mr: 2, minWidth: 150 }}>
                    <InputLabel id="availability-filter-label">Availability</InputLabel>
                    <Select
                        labelId="availability-filter-label"
                        value={availabilityFilter}
                        onChange={handleAvailabilityChange}
                        label="Availability"
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value="In Stock">In Stock</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                        <MenuItem value="Pre-order">Pre-order</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel id="quantity-filter-label">Quantity</InputLabel>
                    <Select
                        labelId="quantity-filter-label"
                        value={quantityFilter}
                        onChange={handleQuantityChange}
                        label="Quantity"
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {[...Array(101).keys()].map((quantity) => (
                            <MenuItem key={quantity} value={quantity}>
                                {quantity}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Products List */}
            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item key={product._id} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6">
                                    ${product.price}
                                </Typography>
                                <Typography variant="body1" color={product.availability === 'In Stock' && product.quantity === 0 ? 'error' : 'textPrimary'}>
                                    {product.availability === 'In Stock' ?
                                        product.quantity > 0 ?
                                            `Quantity: ${product.quantity}` :
                                            'Quantity is 0 (Out of Stock)'
                                        :
                                        product.availability
                                    }
                                </Typography>
                                <Box mt={2}>
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
