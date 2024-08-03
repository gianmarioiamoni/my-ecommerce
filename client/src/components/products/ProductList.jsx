import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productsServices';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';
import { useCategories } from '../../contexts/CategoriesContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const { cart, addToCart, removeFromCart } = useContext(CartContext);
    const { categories } = useCategories();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
                setFilteredProducts(products);
                console.log("ProductList - products", products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const applyFiltersAndSorting = (criteria = sortCriteria) => {
        console.log("Applying filters and sorting...");
        let filtered = products;

        console.log("Search query:", searchQuery);
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        console.log("Selected category:", selectedCategory);
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Ordina i prodotti in base al criterio di ordinamento selezionato
        console.log("Sort criteria:", criteria);
        switch (criteria) {
            case 'price-asc':
                console.log("Sorting by price (ascending)...");
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                console.log("Sorting by price (descending)...");
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                console.log("Sorting by name...");
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'category':
                console.log("Sorting by category...");
                filtered.sort((a, b) => {
                    if (!a.category) return 1;
                    if (!b.category) return -1;
                    return a.category.localeCompare(b.category);
                });
                break;
            default:
                break;
        }

        console.log("Filtered products after sorting:", filtered);
        setFilteredProducts(filtered);
        console.log("Filtered products set successfully.");
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
        console.log("handleSortChange: called");
        console.log("handleSortChange: value", value);
        setSortCriteria(value);
        applyFiltersAndSorting(value);  // Applica immediatamente il nuovo criterio di ordinamento
    };

    const isInCart = (productId) => cart.some(item => item._id === productId);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Product Catalog
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                            <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}> {/* 4:3 aspect ratio */}
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
                                    Availability: {product.availability}
                                </Typography>
                                <Button component={Link} to={`/products/${product._id}`} variant="contained" color="primary">
                                    View
                                </Button>
                                {isInCart(product._id) ? (
                                    <Button size="small" color="secondary" onClick={() => removeFromCart(product._id)}>
                                        Remove from Cart
                                    </Button>
                                ) : (
                                    <Button size="small" color="primary" onClick={() => addToCart(product)}>
                                        Add to Cart
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



