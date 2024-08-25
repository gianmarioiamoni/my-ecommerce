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
} from '@mui/material';

const ReviewForm = ({ productId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetta l'errore

        try {
            await submitReview(productId, { rating, comment });
            alert('Review submitted and awaiting approval');
        } catch (error) {
            setError('Error submitting review');
        }
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
        </Box>
    );
};

export default ReviewForm;
