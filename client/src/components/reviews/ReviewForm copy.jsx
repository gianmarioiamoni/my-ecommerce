import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { submitReview } from '../../services/reviewServices';
import {
    Button,
    TextField,
    Typography,
    Box,
    Rating,
    Alert,
    Snackbar
} from '@mui/material';

const ReviewForm = ({ productId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetta l'errore

        try {
            await submitReview(productId, { rating, comment });
            setSuccessMessage('Review submitted successfully!');
            // alert('Review submitted and awaiting approval');
            setRating(0);
            setComment('');
        } catch (error) {
            // Setup the error message to show in the Snackbar 
            setError(error.message || 'An error occurred');
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
            >
                Submit Review
            </Button>
            {/* Snackbar for the error message */}
            {error && (
                <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            )}

            {/* Snackbar for the success message */}
            {successMessage && (
                <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default ReviewForm;
