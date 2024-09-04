import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productsServices';
import {
    Grid, Card, CardContent, CardMedia, Typography, Button, Container, Box,
    TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme,
    IconButton, Menu, MenuItem as DropdownItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';

import { CartContext } from '../../contexts/CartContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishListContext';

import AddToCartButton from '../../components/products/AddToCartButton';
import AddToWishlistButton from '../../components/products/AddToWishlistButton';
import CreateNewWishlistDialog from '../../components/products/CreateNewWishlistDialog';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newWishlistName, setNewWishlistName] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0); // to be removed if wishlist will be in separated component
    const [localWishlists, setLocalWishlists] = useState([]);

    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const { categories } = useCategories();
    const { user } = useContext(AuthContext);
    const { wishlists, handleCreateWishlist, handleAddToWishlist, isProductInAnyWishlist } = useWishlist();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                products.forEach(product => {
                    product.availableQuantity = product.quantity;
                });
                setProducts(products);
                setFilteredProducts(products);
                console.log("products: ", products)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Sync local wishlists with global state
        setLocalWishlists(wishlists);
    }, [wishlists]);

    const applyFiltersAndSorting = (criteria = sortCriteria) => {
        let filtered = products;

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        switch (criteria) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'category':
                filtered.sort((a, b) => {
                    if (!a.category) return 1;
                    if (!b.category) return -1;
                    return a.category.localeCompare(b.category);
                });
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    useEffect(() => {
        applyFiltersAndSorting();
    }, [searchQuery, selectedCategory, products]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortCriteria(value);
        applyFiltersAndSorting(value);
    };

    const handleWishlistMenuOpen = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleWishlistMenuClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    const handleWishlistSelection = async (wishlistId) => {
        if (wishlistId === 'create-new') {
            setOpenCreateDialog(true);
        } else {
            await handleAddToWishlist(wishlistId, selectedProduct._id);
            setForceUpdate((prev) => prev + 1);
            handleWishlistMenuClose();
        }
    };

    const handleCreateNewWishlist = async () => {
        if (newWishlistName.trim()) {
            const newWishlist = await handleCreateWishlist(newWishlistName);
            await handleAddToWishlist(newWishlist._id, selectedProduct._id);
            setForceUpdate((prev) => prev + 1);
            handleCloseCreateDialog();
        }
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewWishlistName('');
        handleWishlistMenuClose();
    };

    const isInCart = (productId) => cart.some(item => item._id === productId);

    return (
        <Container sx={{ minWidth: '320px' }}>
            <Typography variant="h4" marginTop={5} gutterBottom>
                Product Catalog
            </Typography>

            {/* Searching and filtering */}
            <Box sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: 2,
                mb: 2
            }}>
                <TextField
                    label="Search Products"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="Category"
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 160 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortCriteria}
                        onChange={handleSortChange}
                        label="Sort By"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="price-asc">Price: Low to High</MenuItem>
                        <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="category">Category</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Product list */}
            <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
                                <CardMedia
                                    component="img"
                                    alt={product.name}
                                    image={product.imageUrls[0] || 'https://picsum.photos/200/300'}
                                    title={product.name}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ flexGrow: 1 }}>
                                {/* Product info */}
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6">
                                    ${product.price}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Availability: {product.availability}
                                </Typography>
                                <Button component={Link} to={`/products/${product._id}`} variant="contained" color="primary">
                                    View
                                </Button>

                                {/* Add to cart / remove from cart button */}
                                {user && !user.isAdmin &&
                                    <AddToCartButton
                                        isInCart={isInCart(product._id)}
                                        addToCart={() => addToCart(product)}
                                        removeFromCart={() => removeFromCart(product._id)}
                                        isDisabled={product.availability !== 'In Stock' || product.quantity <= 0}
                                    />
                                }

                                {/* Add to wishlist button */}
                                {user && !user.isAdmin && 
                                    <AddToWishlistButton
                                    product={product}
                                    isInWishlist={isProductInAnyWishlist(product._id)}
                                    handleWishlistSelection={handleWishlistSelection}
                                    handleWishlistMenuOpen={handleWishlistMenuOpen}
                                    handleWishlistMenuClose={handleWishlistMenuClose}
                                    anchorEl={anchorEl}
                                    wishlists={wishlists}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            {/* Create New Wishlist Dialog */}
            <CreateNewWishlistDialog
                openCreateDialog={openCreateDialog}
                handleCloseCreateDialog={handleCloseCreateDialog}
                newWishlistName={newWishlistName}
                setNewWishlistName={setNewWishlistName}
                handleCreateNewWishlist={handleCreateNewWishlist}
            />
        </Container>
    );
};

export default ProductList;








