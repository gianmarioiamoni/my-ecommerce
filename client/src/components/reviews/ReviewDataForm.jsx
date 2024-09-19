import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { createReview, hasPurchasedProduct, hasReviewedProduct } from '../../services/reviewServices';
import { Button, TextField, Typography, Box, Rating, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation

/**
 * The ReviewDataForm component renders a form to submit a review for a product.
 * 
 * The component is wrapped in a Box component and contains a Typography component
 * with the title, a Rating component to select the rating, a TextField component
 * for the comment, and a Button component to submit the form.
 * 
 * The component also renders an Alert component if there is an error, and a Snackbar
 * component with a success message if the review is submitted successfully.
 * 
 * The component uses the `createReview` function from the `reviewServices` module to
 * create a new review in the database.
 * 
 * The component also uses the `useEffect` hook to check if the user has purchased
 * the product and if the user has already reviewed the product.
 * 
 * The component also uses the `useTranslation` hook to translate the text in the
 * component.
 * 
 * @param {{productId: string, onReviewSubmit: function}} props - The props passed
 * to the component.
 * @returns {JSX.Element} The component element.
 */
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

    /**
     * Handles the submission of the form.
     * 
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!canReview) {
            // If the user cannot review, show an error message
            setError(t('reviews.cannotReviewError'));
            return;
        }

        try {
            // Create a new review
            const submittedReview = await createReview(productId, { rating, comment });
            // Create a new review object with the user's data
            const newReview = { ...submittedReview, userId: { _id: user.id, name: user.name, photoUrl: user.photoUrl } };
            // Set the success message
            setSuccessMessage(t('reviews.reviewSuccess'));
            // Reset the form
            setRating(0);
            setComment('');
            // Call the callback function with the new review
            onReviewSubmit(newReview);
        } catch (error) {
            // If there is an error, show an error message
            setError(error.response?.data?.message || t('reviews.genericError'));
        }
    };

    /**
     * Closes the success/error message.
     */
    const handleClose = () => {
        // Reset the error message
        setError(null);
        // Reset the success message
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

