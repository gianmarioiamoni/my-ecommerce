import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getAllProducts } from '../../services/productsServices';

import {
    Grid, Card, CardContent, CardMedia, Typography, Button, Container, Box,
    TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme
} from '@mui/material';

import { CartContext } from '../../contexts/CartContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishListContext';

import AddToCartButton from '../../components/products/AddToCartButton';
import AddToWishlistButton from '../../components/products/AddToWishlistButton';
import CreateNewWishlistDialog from '../../components/products/CreateNewWishlistDialog';

/**
 * The ProductList component displays a list of products.
 * It allows the user to search and filter the products by category and price.
 * It also allows the user to add products to the cart and to their wishlist.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ProductList = () => {
    const { t, i18n } = useTranslation(); 

    /**
     * The state of the component.
     */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newWishlistName, setNewWishlistName] = useState('');

    /**
     * The context variables.
     */
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const { categories } = useCategories();
    const { user } = useContext(AuthContext);
    const { wishlists, handleCreateWishlist, handleAddToWishlist, isProductInAnyWishlist } = useWishlist();

    /**
     * The theme variables.
     */
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    /**
     * A function to update the available quantities in the products.
     * It maps over the products and adds a new property, availableQuantity, to each product.
     * The availableQuantity is set to the quantity of the product.
     * @param {Object[]} products The products to update.
     * @returns {Object[]} The products with the availableQuantity property.
     */
    const mapAvailableQuantities = (products) => {
        return products.map((product) => ({
            ...product,
            availableQuantity: product.quantity,
        }));
    };

    // Fetch all products from the server
    const { data: products, error, isLoading } = useQuery('products', getAllProducts, {
        select: (data) => mapAvailableQuantities(data), // Apply the mapping function to the data 
    });


    useEffect(() => {
        if (products) {
            setFilteredProducts(products); // Update the filtered products state with the fetched products 
        }
    }, [products]);

    /**
     * Applies the filters and sorting to the products.
     * @param {string} criteria - The criteria to sort by.
     */
    const applyFiltersAndSorting = (criteria = sortCriteria) => {
        let filtered = products;

        /**
         * Applies the search filter.
         */
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        /**
         * Applies the category filter.
         */
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        /**
         * Applies the sorting.
         */
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
        /**
         * Applies the filters and sorting on mount and on searchQuery, selectedCategory and products changes.
         */
        applyFiltersAndSorting();
    }, [searchQuery, selectedCategory, products]);


    /**
     * Handles the search input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event.
     */
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Handles the category selection change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event.
     */
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    /**
     * Handles the sort selection change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event.
     */
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortCriteria(value);
        applyFiltersAndSorting(value);
    };

    /**
     * Handles the wishlist menu open.
     * @param {React.MouseEvent<HTMLButtonElement>} event - The event.
     * @param {Product} product - The product.
     */
    const handleWishlistMenuOpen = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    /**
     * Handles the wishlist menu close.
     */
    const handleWishlistMenuClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    /**
     * Handles the wishlist selection.
     * @param {string} wishlistId - The ID of the wishlist.
     */
    const handleWishlistSelection = async (wishlistId) => {
        if (wishlistId === 'create-new') {
            setOpenCreateDialog(true);
        } else {
            await handleAddToWishlist(wishlistId, selectedProduct._id);
            handleWishlistMenuClose();
        }
    };

    /**
     * Handles the create new wishlist.
     */
    const handleCreateNewWishlist = async () => {
        if (newWishlistName.trim()) {
            const newWishlist = await handleCreateWishlist(newWishlistName);
            await handleAddToWishlist(newWishlist._id, selectedProduct._id);
            handleCloseCreateDialog();
        }
    };

    /**
     * Handles the create new wishlist dialog close.
     */
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewWishlistName('');
        handleWishlistMenuClose();
    };

    /**
     * Checks if a product is in the cart.
     * @param {string} productId - The ID of the product.
     * @returns {boolean} True if the product is in the cart, false otherwise.
     */
    const isInCart = (productId) => cart.some(item => item._id === productId);

    return (
        <Container sx={{ minWidth: '320px' }}>
            <Typography variant="h4" marginTop={5} gutterBottom>
                {t('productList.productCatalogTitle')}
            </Typography>

            {/* Searching and filtering */}
            <Box sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: 2,
                mb: 2
            }}>
                <TextField
                    label={t('productList.searchLabel')}
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>{t('productList.categoryLabel')}</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label={t('productList.categoryLabel')}
                    >
                        <MenuItem value="">
                            <em>{t('productList.allCategories')}</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 160 }}>
                    <InputLabel>{t('productList.sortByLabel')}</InputLabel>
                    <Select
                        value={sortCriteria}
                        onChange={handleSortChange}
                        label={t('productList.sortByLabel')}
                    >
                        <MenuItem value="">
                            <em>{t('productList.none')}</em>
                        </MenuItem>
                        <MenuItem value="price-asc">{t('productList.priceAsc')}</MenuItem>
                        <MenuItem value="price-desc">{t('productList.priceDesc')}</MenuItem>
                        <MenuItem value="name">{t('productList.name')}</MenuItem>
                        <MenuItem value="category">{t('productList.category')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Product list */}
            <Grid container spacing={4}>
                {filteredProducts?.map((product) => (
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
                                    {t('productList.availabilityLabel')}: {product.availability}
                                </Typography>
                                <Button component={Link} to={`/products/${product._id}`} variant="contained" color="primary">
                                    {t('productList.viewButtonLabel')}
                                </Button>

                                {/* Add to cart / remove from cart button */}
                                {user && !user.isAdmin &&
                                    <AddToCartButton
                                        isInCart={isInCart(product._id)}
                                        addToCart={() => addToCart(product, user)}
                                        removeFromCart={() => removeFromCart(product._id, user)}
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