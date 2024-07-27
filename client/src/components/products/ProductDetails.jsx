import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, CardActions } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-medium-image-zoom/dist/styles.css';
import { CartContext } from '../../contexts/CartContext';
import { getProductById } from '../../services/productsServices';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const isInCart = cart.some(item => item.id === product.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                setProduct(product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <Container>
            <Card className="product-card">
                <div className="product-image-container">
                    <Carousel showThumbs={product.imageUrls && product.imageUrls.length > 1} dynamicHeight={true} showArrows={true}>
                        {product.imageUrls && product.imageUrls.map((url, index) => (
                            <div key={index} className="carousel-image-wrapper">
                                <img src={url} alt={`${product.name} ${index + 1}`} className="product-image" />
                            </div>
                        ))}
                    </Carousel>
                </div>
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

