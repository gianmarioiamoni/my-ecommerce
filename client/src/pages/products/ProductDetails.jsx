// src/pages/ProductDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, CardActions } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getProductById } from '../../services/productsServices';
import { getProductReviews, updateReview, hasPurchasedProduct, hasReviewedProduct } from '../../services/reviewServices';
import { isOrderDelivered } from '../../services/ordersServices';
import { trackEvent } from '../../services/eventsServices';
import { Rating } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishListContext';
import { useTranslation } from 'react-i18next'; // Importa useTranslation

import './ProductDetails.css';
import ReviewDataForm from '../../components/reviews/ReviewDataForm';
import ReviewList from '../../components/reviews/ReviewList';

const ProductDetails = () => {
    const { t } = useTranslation('productDetails'); // Usa il namespace specificato
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);

    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { wishlists, handleCreateWishlist, handleAddToWishlist } = useWishlist();

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
                const isDelivered = await isOrderDelivered(user.id, product._id);

                setCanReview(hasPurchased && !reviewed && isDelivered);

                if (!user.isAdmin) {
                    trackEvent('view', product._id, user.id, { source: 'product_details' })
                }
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
            const updated = await updateReview(updatedReview._id, updatedReview);
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === updated._id ? updated : review
                )
            );
        } catch (error) {
            console.error('Failed to update review:', error);
        }
    };

    const handleWishlistClick = (productId) => {
        if (wishlists.length > 0) {
            const wishlistId = prompt(t('selectWishlist'), wishlists[0]._id); // Usa la funzione t per il prompt
            if (wishlistId) {
                handleAddToWishlist(wishlistId, productId);
            }
        } else {
            const wishlistName = prompt(t('createWishlist')); // Usa la funzione t per il prompt
            if (wishlistName) {
                handleCreateWishlist(wishlistName).then(newWishlist => {
                    handleAddToWishlist(newWishlist._id, productId);
                });
            }
        }
    };

    const isInCart = cart.some(item => item._id === product?._id);

    if (!product) {
        return <div>{t('loading')}</div>; // Usa la funzione t per il messaggio di caricamento
    }

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
                        {t('availability')}: {product.availability}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {t('rating')}:
                        <Rating
                            value={product.averageRating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ marginLeft: 1 }}
                        />
                        ({(product.averageRating?.toFixed(1) || 0)} / 5 {t('on')} {product.reviewCount || 0} {t('reviews')})
                    </Typography>
                </CardContent>
                <CardActions>
                    {user && !user.isAdmin && isInCart && (
                        <Button size="small" color="secondary" onClick={() => removeFromCart(product._id, user)}>
                            {t('removeFromCart')}
                        </Button>
                    )}
                    {user && !user.isAdmin && !isInCart && (
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => addToCart(product, user)}
                            disabled={product.availability !== 'In Stock' || product.quantity <= 0}
                        >
                            {t('addToCart')}
                        </Button>
                    )}
                    {user && !user.isAdmin && (
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => handleWishlistClick(product._id)}
                            startIcon={<FavoriteIcon />}
                        >
                            {t('addToWishlist')}
                        </Button>
                    )}
                </CardActions>
            </Card>
            {user && !user.isAdmin && canReview &&
                <ReviewDataForm productId={id} onReviewSubmit={newReview => setReviews([newReview, ...reviews])} />
            }
            <ReviewList reviews={reviews} onEditReview={onEditReview} />
        </Container>
    );
};

export default ProductDetails;



