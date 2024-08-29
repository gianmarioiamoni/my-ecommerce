import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createReview, hasPurchasedProduct } from '../../services/reviewServices';
import {
    Button,
    TextField,
    Typography,
    Box,
    Rating,
    Alert,
    Snackbar
} from '@mui/material';

const ReviewForm = ({ productId, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        const checkPurchase = async () => {
            try {
                const hasPurchased = await hasPurchasedProduct(user.id, productId);
                setCanReview(hasPurchased);
                if (!hasPurchased) {
                    setError('You can only review products you have purchased.');
                }
            } catch (err) {
                setError('Error verifying purchase status.');
            }
        };

        if (user) {
            checkPurchase();
        }
    }, [user, productId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!canReview) {
            setError('You cannot review this product because you have not purchased it.');
            return;
        }

        try {
            const submittedReview = await createReview(productId, { rating, comment });
            const newReview = { ...submittedReview, userId: user };
            setSuccessMessage('Review submitted successfully!');
            setRating(0);
            setComment('');
            onReviewSubmit(newReview);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccessMessage('');
    };

    if (!user) {
        return <Alert severity="warning">You must be logged in to leave a review</Alert>;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}
        >
            <Typography variant="h6" gutterBottom>
                Leave a Review
            </Typography>
            <Rating
                name="rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={1}
                required
            />
            <TextField
                fullWidth
                variant="outlined"
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                sx={{ mt: 2 }}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={!canReview}
            >
                Submit Review
            </Button>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReviewForm;

