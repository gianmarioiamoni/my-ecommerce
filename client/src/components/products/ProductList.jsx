import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productsServices';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container, Box } from '@mui/material';
import { CartContext } from '../../contexts/CartContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { cart, addToCart, removeFromCart } = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
                console.log("ProductList - products", products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const isInCart = (productId) => cart.some(item => item._id === productId);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Product Catalog
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
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



