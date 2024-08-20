import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, CardActions } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CartContext } from '../../contexts/CartContext';
import { getProductById } from '../../services/productsServices';
import { AuthContext } from '../../contexts/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                // add availableQuantity = quantity to product
                product.availableQuantity = product.quantity;
                
                setProduct(product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    const isInCart = cart.some(item => item._id === product._id);

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
                    <Typography variant="body2" color="textSecondary">
                        Availability: {product.availability}
                    </Typography>
                </CardContent>
                <CardActions>
                    {!user.isAdmin && isInCart && (
                        <Button size="small" color="secondary" onClick={() => removeFromCart(product._id)}>
                            Remove from Cart
                        </Button>
                    )}
                    {!user.isAdmin && !isInCart && (
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => addToCart(product)}
                            disabled={product.availability !== 'In Stock' || product.quantity <= 0}
                        >
                            Add to Cart
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Container>
    );
};

export default ProductDetails;




