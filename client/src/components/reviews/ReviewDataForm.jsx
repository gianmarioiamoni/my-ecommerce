import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createReview, hasPurchasedProduct, hasReviewedProduct } from '../../services/reviewServices';
import {
    Button,
    TextField,
    Typography,
    Box,
    Rating,
    Alert,
    Snackbar
} from '@mui/material';

const ReviewDataForm = ({ productId, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const hasPurchased = await hasPurchasedProduct(user.id, productId);
                const reviewed = await hasReviewedProduct(user.id, productId);

                setCanReview(hasPurchased && !reviewed);
                setAlreadyReviewed(reviewed);

                if (!hasPurchased) {
                    setError('You can only review products you have purchased.');
                } else if (reviewed) {
                    setError('You have already reviewed this product.');
                }
            } catch (err) {
                setError('Error verifying purchase or review status.');
            }
        };

        if (user) {
            checkPermissions();
        }
    }, [user, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!canReview) {
            setError('You cannot review this product because you have not purchased it or have already reviewed it.');
            return;
        }

        try {
            const submittedReview = await createReview(productId, { rating, comment });
            // const newReview = { ...submittedReview, userId: user };
            const newReview = { ...submittedReview, userId: { _id: user.id, name: user.name, photoUrl: user.photoUrl } };
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
                // disabled={alreadyReviewed}
                disabled={!canReview}
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
                // disabled={alreadyReviewed}
                disabled={!canReview}
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

export default ReviewDataForm;


