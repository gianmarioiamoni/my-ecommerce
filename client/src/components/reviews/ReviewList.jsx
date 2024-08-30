import React, { useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Avatar, Divider, Button } from '@mui/material';
import { Rating } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';  


const ReviewList = ({ reviews, onEditReview }) => {
    const { user } = useContext(AuthContext);  

    if (reviews.length === 0) {
        return <Typography>No reviews yet</Typography>;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Customer Reviews
            </Typography>
            <List>
                {reviews.map((review) => (
                    <Box key={review._id}>
                        <ListItem alignItems="flex-start">
                            <Avatar alt={review.userId.name} src={review.userId.photoUrl} />
                            <ListItemText
                                primary={
                                    <>
                                        <Typography component="span" variant="body1" fontWeight="bold">
                                            {review.userId.name}
                                        </Typography>
                                        <Rating value={review.rating} readOnly precision={0.5} />
                                    </>
                                }
                                secondary={
                                    <>
                                        {review.comment}
                                        {/* Show edit button only if the user is the author of the review */}
                                        {user && review.userId._id === user.id && (
                                            <Button
                                                variant="text"
                                                color="primary"
                                                sx={{ mt: 1 }}
                                                onClick={() => onEditReview(review)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </>
                                }
                                sx={{ ml: 2 }}
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

