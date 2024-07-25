import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, CardActions } from '@mui/material';
import { CartContext } from '../contexts/CartContext';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
console.log("serverURL", serverURL);

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    const { addToCart, removeFromCart, cart } = useContext(CartContext);

    const isInCart = cart.some(item => item.id === product.id);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`${serverURL}/products/${id}`);
            setProduct(data);
        };

        fetchData();
    }, [id]);

    return (
        <Container>
            <Card>
                <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={product.imageUrl}
                    title={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.description}
                    </Typography>
                    <Typography variant="h6">
                        ${product.price}
                    </Typography>
                </CardContent>
                <CardActions>
                    {isInCart ? (
                        <Button size="small" color="secondary" onClick={() => removeFromCart(product.id)}>
                            Remove from Cart
                        </Button>
                    ) : (
                        <Button size="small" color="primary" onClick={() => addToCart(product)}>
                            Add to Cart
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Container>
    );
};

export default ProductDetails;


