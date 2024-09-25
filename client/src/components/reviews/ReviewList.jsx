import React, { useState, useContext } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Divider,
    IconButton,
    TextField,
} from '@mui/material';
import { Rating } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'; 
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; 

/**
 * A component that renders a list of reviews.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Array} props.reviews - The reviews to render.
 * @param {function} props.onEditReview - The function that will be called when the user wants to edit a review.
 * @returns {JSX.Element} The component element.
 */
const ReviewList = ({ reviews, onEditReview }) => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation(); 
    const [editingReviewId, setEditingReviewId] = useState(null); // Keep track of the review being edited 
    const [editedRating, setEditedRating] = useState(0);
    const [editedComment, setEditedComment] = useState('');


    /**
     * Handles the click of the edit button for a review.
     * 
     * @param {Object} review - The review being edited.
     */
    const handleEditClick = (review) => {
        setEditingReviewId(review._id);
        setEditedRating(review.rating);
        setEditedComment(review.comment);
    };

    /**
     * Handles the click of the save button for a review.
     */
    const handleSaveClick = () => {
        onEditReview({
            _id: editingReviewId,
            rating: editedRating,
            comment: editedComment,
        });
        setEditingReviewId(null);
    };

    if (reviews.length === 0) {
        return <Typography>{t('reviews.noReviews')}</Typography>;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                {t('reviews.customerReviews')}
            </Typography>
            <List>
                {reviews.map((review) => (
                    <Box key={review._id}>
                        <ListItem alignItems="flex-start">
                            {review.userId.photoUrl ? (
                                <Avatar src={review.userId.photoUrl} alt={review.userId.name} />
                            ) : (
                                <Avatar>{review.userId.name ? review.userId.name.charAt(0) : review.userId.email.charAt(0)}</Avatar>
                            )}

                            <ListItemText
                                primary={
                                    <>
                                        <Typography component="span" variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                                            {review.userId.name}
                                        </Typography>
                                        {editingReviewId === review._id ? (
                                            <Rating
                                                name="edit-rating"
                                                value={editedRating}
                                                onChange={(e, newValue) => setEditedRating(newValue)}
                                                precision={0.5}
                                            />
                                        ) : (
                                            <Rating value={review.rating} readOnly precision={0.5} sx={{ ml: 1 }} />
                                        )}
                                    </>
                                }
                                secondary={
                                    <>
                                        {editingReviewId === review._id ? (
                                            <Box sx={{ mt: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={editedComment}
                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                    multiline
                                                    rows={2}
                                                />
                                            </Box>
                                        ) : (
                                            <Typography component="span" sx={{ ml: 1 }}>{review.comment}</Typography>
                                        )}
                                        {user && review.userId._id === user.id && (
                                            <IconButton
                                                sx={{ mt: 1 }}
                                                onClick={
                                                    editingReviewId === review._id
                                                        ? handleSaveClick
                                                        : () => handleEditClick(review)
                                                }
                                            >
                                                {editingReviewId === review._id ? (
                                                    <SaveIcon color="primary" />
                                                ) : (
                                                    <EditIcon color="primary" />
                                                )}
                                            </IconButton>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default ReviewList;

