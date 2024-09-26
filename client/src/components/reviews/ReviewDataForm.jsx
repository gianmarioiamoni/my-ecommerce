import React, { useState, useContext } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import { Button, TextField, Typography, Box, Rating, Alert, Snackbar } from '@mui/material';

import { useTranslation } from 'react-i18next'; 


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
 * The component also uses the `useTranslation` hook to translate the text in the
 * component.
 * 
 * @param {{onAddReview: function, setCanReview: function}} props - The props passed
 * to the component.
 * @returns {JSX.Element} The component element.
 */
const ReviewDataForm = ({ onAddReview, setCanReview}) => {
    const { t } = useTranslation(); // No need to specify a namespace here
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * Handles the submission of the form.
     * 
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Create a new review
        const newReview = { rating, comment };
        setSuccessMessage(t('reviews.reviewSuccess'));
        
        // Reset the form
        setRating(0);
        setComment('');

        setCanReview(false);

        // Call the callback function with the new review
        onAddReview(newReview);
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
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
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

