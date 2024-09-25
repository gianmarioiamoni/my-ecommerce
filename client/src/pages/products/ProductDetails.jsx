// src/pages/ProductDetails.js
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { Container, Typography, Card, CardContent, Button, CardActions } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Rating } from '@mui/material';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { getProductById } from '../../services/productsServices';
import {
    getProductReviews,
    createReview,
    updateReview,
    hasPurchasedProduct,
    hasReviewedProduct
} from '../../services/reviewServices';
import { isOrderDelivered } from '../../services/ordersServices';
import { trackEvent } from '../../services/eventsServices';

import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishListContext';

import { useTranslation } from 'react-i18next'; 

import './ProductDetails.css';

import ReviewDataForm from '../../components/reviews/ReviewDataForm';
import ReviewList from '../../components/reviews/ReviewList';

/**
 * The ProductDetails component renders a product details page.
 * It fetches the product and its reviews from the server.
 * It displays the product details and allows the user to add the product to the cart, wishlist or edit a review.
 * It also displays a list of reviews for the product.
 * @returns {JSX.Element} The JSX element for the ProductDetails component
 */
const ProductDetails = () => {
    const { t } = useTranslation('productDetails'); 
    const { id } = useParams();
    const [canReview, setCanReview] = useState(false);

    const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { wishlists, handleCreateWishlist, handleAddToWishlist } = useWishlist();

    const queryClient = useQueryClient();

    // Fetch the product and reviews based on the ID

    // Query to get the product based on the ID
    const { data: product, isLoading: productLoading, error: productError } = useQuery(
        ['product', id],
        async () => {
            const product = await getProductById(id);
            product.availableQuantity = product.quantity;
            return product;
        },
        {
            enabled: !!id, // Exec the query only if the ID is present
        }
    );

    // Check permissions and set canReview state
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const hasPurchased = await hasPurchasedProduct(user.id, product._id);
                const reviewed = await hasReviewedProduct(user.id, product._id);
                const isDelivered = await isOrderDelivered(user.id, product._id);
                console.log("checkPermissions() - hasPurchased:", hasPurchased, "reviewed:", reviewed, "isDelivered:", isDelivered);

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

    // Query to get the reviews based on the ID
    const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery(
        ['reviews', id],
        () => getProductReviews(id),
        {
            enabled: !!id, // Exec the query only if the ID is present
        }
    );

    const newReviewMutation = useMutation(
        (newReview) => createReview(newReview), // Chiamata API per inviare la recensione
        {
            // Aggiorna la cache con la nuova recensione in caso di successo
            onSuccess: (newReview) => {
                newReview = { ...newReview, productId: product._id, userId: { ...user } };
                console.log('Review submitted successfully:', newReview);
                queryClient.setQueryData(['reviews', newReview.productId], (oldReviews = []) => [
                    ...oldReviews,
                    newReview,
                ]);
            },
            // Gestione errori (opzionale)
            onError: (error) => {
                console.error('Failed to submit review:', error);
            },
        }
    );

    const onAddReview = (review) => {
        console.log("onAddReview() - user:", user)
        console.log("onAddReview() - review:", review)
        review = { ...review, productId: product._id, userId: { ...user } };
        console.log("onAddReview() - review:", review);
        newReviewMutation.mutate(review);
    };

    const updateReviewMutation = useMutation(
        (updatedReview) => updateReview(updatedReview._id, updatedReview),
        {
            // Success callback when the mutation is successful
            onSuccess: (updated) => {
                queryClient.setQueryData(['reviews', updated.productId], (oldReviews) =>
                    oldReviews.map((review) =>
                        review._id === updated._id ? updated : review
                    )
                );
            },
            // Errors callback
            onError: (error) => {
                console.error('Failed to update review:', error);
            }
        }
    );
    
    // Function to update a review
    const onEditReview = (updatedReview) => {
        updateReviewMutation.mutate(updatedReview);
    };

    /**
     * Handles the click on the wishlist button.
     * If the user has wishlists, it prompts the user to select one.
     * If the user doesn't have wishlists, it prompts the user to create one.
     * Then it adds the product to the selected/created wishlist.
     * @param {string} productId - The id of the product to add to the wishlist
     */
    const handleWishlistClick = (productId) => {
        if (wishlists.length > 0) {
            const wishlistId = prompt(t('selectWishlist'), wishlists[0]._id); 
            if (wishlistId) {
                handleAddToWishlist(wishlistId, productId);
            }
        } else {
            const wishlistName = prompt(t('createWishlist')); 
            if (wishlistName) {
                handleCreateWishlist(wishlistName).then(newWishlist => {
                    handleAddToWishlist(newWishlist._id, productId);
                });
            }
        }
    };

    
    const isInCart = cart.some(item => item._id === product?._id);

    // if (!product) {
    //     return <div>{t('loading')}</div>; 
    // }
    if (productLoading || reviewsLoading) {
        return <div>{t('loading')}</div>; 
    }

    if (productError) {
        return <div>{t('error')}</div>; 
    }

    if (reviewsError) { 
        return <div>{t('error')}</div>; 
    }

    if (!product) {
        return <div>{t('notFound')}</div>; 
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
            {/* Reviews section */}
            {user && !user.isAdmin && canReview &&
                <ReviewDataForm onAddReview={onAddReview} setCanReview={setCanReview}/>
            }
            <ReviewList reviews={reviews} onEditReview={onEditReview} />
        </Container>
    );
};

export default ProductDetails;



