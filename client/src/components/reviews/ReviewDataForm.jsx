import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createReview, hasPurchasedProduct, hasReviewedProduct } from '../../services/reviewServices';
import { Button, TextField, Typography, Box, Rating, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ReviewDataForm = ({ productId, onReviewSubmit }) => {
    const { t } = useTranslation(); // No need to specify a namespace here
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
                    setError(t('reviews.purchaseError'));
                } else if (reviewed) {
                    setError(t('reviews.alreadyReviewedError'));
                }
            } catch (err) {
                setError(t('reviews.verificationError'));
            }
        };

        if (user) {
            checkPermissions();
        }
    }, [user, productId, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!canReview) {
            setError(t('reviews.cannotReviewError'));
            return;
        }

        try {
            const submittedReview = await createReview(productId, { rating, comment });
            const newReview = { ...submittedReview, userId: { _id: user.id, name: user.name, photoUrl: user.photoUrl } };
            setSuccessMessage(t('reviews.reviewSuccess'));
            setRating(0);
            setComment('');
            onReviewSubmit(newReview);
        } catch (error) {
            setError(error.response?.data?.message || t('reviews.genericError'));
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccessMessage('');
    };

    if (!user) {
        return <Alert severity="warning">{t('reviews.loginWarning')}</Alert>;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}
        >
            <Typography variant="h6" gutterBottom>
                {t('reviews.leaveReview')}
            </Typography>
            <Rating
                name="rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={1}
                required
                disabled={!canReview}
            />
            <TextField
                fullWidth
                variant="outlined"
                label={t('reviews.commentLabel')}
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                sx={{ mt: 2 }}
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
                {t('reviews.submitReview')}
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

