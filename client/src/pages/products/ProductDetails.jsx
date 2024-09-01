import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, CardActions } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CartContext } from '../../contexts/CartContext';
import { getProductById } from '../../services/productsServices';
import { getProductReviews, updateReview, hasPurchasedProduct, hasReviewedProduct } from '../../services/reviewServices';
import { Rating } from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';

import './ProductDetails.css';

import ReviewDataForm from '../../components/reviews/ReviewDataForm';
import ReviewList from '../../components/reviews/ReviewList';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null); 
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(id);
                product.availableQuantity = product.quantity; 
                setProduct(product);

                const reviewsData = await getProductReviews(id);
                setReviews(reviewsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const hasPurchased = await hasPurchasedProduct(user.id, product._id);
                const reviewed = await hasReviewedProduct(user.id, product._id);

                setCanReview(hasPurchased && !reviewed);
            } catch (err) {
                console.error(err);
            }
        };

        if (user && product) {
            checkPermissions();
        }
    }, [user, product]);

    const onEditReview = async (updatedReview) => {
        try {
            // Call the API to update the review in the backend
            const updated = await updateReview(updatedReview._id, updatedReview);
            console.log('updated:', updated);
            console.log('updatedReview:', updatedReview);
            // Update the local state with the updated review
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === updated._id ? updated : review
                )
            );
        } catch (error) {
            console.error('Failed to update review:', error);
        }
    };

    const isInCart = cart.some(item => item._id === product?._id); // Check if product is not null

    if (!product) {
        return <div>Loading...</div>; // Add a loader or a loading message 
    }

    return (
        <Container>
            <Card className="product-card">
                {/* Product Images section */}
                <div className="product-image-container">
                    <Carousel showThumbs={product.imageUrls && product.imageUrls.length > 1} dynamicHeight={true} showArrows={true}>
                        {product.imageUrls && product.imageUrls.map((url, index) => (
                            <div key={index} className="carousel-image-wrapper">
                                <img src={url} alt={`${product.name} ${index + 1}`} className="product-image" />
                            </div>
                        ))}
                    </Carousel>
                </div>
                {/* Product Info section  */}
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
                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Rating: 
                        <Rating 
                            value={product.averageRating || 0} 
                            precision={0.1} 
                            readOnly 
                            size="small" 
                            sx={{ marginLeft: 1 }}
                        /> 
                        ({(product.averageRating?.toFixed(1) || 0)} / 5 su {product.reviewCount || 0} reviews)
                    </Typography>
                </CardContent>
                <CardActions>
                    {user && !user.isAdmin && isInCart && (
                        <Button size="small" color="secondary" onClick={() => removeFromCart(product._id)}>
                            Remove from Cart
                        </Button>
                    )}
                    {user &&!user.isAdmin && !isInCart && (
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
            {/* Reviews section */}
            {/* If there is an user logged in and the user is not an Admin, show review form  */}
            {user && !user.isAdmin && canReview &&
                <ReviewDataForm productId={id} onReviewSubmit={newReview => setReviews([newReview, ...reviews])} />
            }
            <ReviewList reviews={reviews} onEditReview={onEditReview}/>
        </Container>
    );
};

export default ProductDetails;








