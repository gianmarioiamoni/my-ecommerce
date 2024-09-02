import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productsServices';
import {
    Grid, Card, CardContent, CardMedia, Typography, Button, Container, Box,
    TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { CartContext } from '../../contexts/CartContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishListContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const { categories } = useCategories();
    const { user } = useContext(AuthContext);
    const { wishlists, handleCreateWishlist, handleAddToWishlist } = useWishlist();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();

                // per each product in products, add availableQuantity equal to quantity
                products.forEach(product => {
                    product.availableQuantity = product.quantity
                });

                setProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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

    const handleWishlistClick = async (productId) => {
        console.log("handleWishlistClick called");
        console.log("wishlists:", wishlists);
        // if the user has a wishlist, ask to select one
        if (wishlists.length > 0) {
            const wishlistId = prompt("Select a wishlist:", wishlists[0]._id);
            console.log("selected wishlistId:", wishlistId);
            if (wishlistId) {
                handleAddToWishlist(wishlistId, productId);
            }
        } else {
            // Create a new wishlist if none exists
            const wishlistName = prompt("Create a new wishlist:");
            console.log("selected wishlistName:", wishlistName);
            if (wishlistName) {
                const newWishList = await handleCreateWishlist(wishlistName);
                console.log("newWishList:", newWishList);
                await handleAddToWishlist(newWishList._id, productId);
                // handleCreateWishlist(wishlistName).then(newWishlist => {
                //     console.log("newWishlist:", newWishlist);
                //     handleAddToWishlist(newWishlist._id, productId);
                // });
            }
        }
    };

    const isInCart = (productId) => cart.some(item => item._id === productId);

    return (
        <Container sx={{ minWidth: '320px' }}>
            <Typography variant="h4" marginTop={5} gutterBottom>
                Product Catalog
            </Typography>

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
                                {/* Add to cart / remove from cartbutton */}
                                {user && !user.isAdmin && isInCart(product._id) && (
                                    <Button size="small" color="secondary" onClick={() => removeFromCart(product._id)}>
                                        Remove from Cart
                                    </Button>
                                )}
                                {user && !user.isAdmin && !isInCart(product._id) && (
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => addToCart(product)}
                                        disabled={product.availability !== 'In Stock' || product.quantity <= 0}
                                    >
                                        Add to Cart
                                    </Button>
                                )}
                                {/* Add wishlist button */}
                                {user && !user.isAdmin && (
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => handleWishlistClick(product._id)}
                                        startIcon={<FavoriteIcon />}
                                    >
                                        Add to Wishlist
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;





