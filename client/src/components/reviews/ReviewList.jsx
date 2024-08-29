import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { Rating } from '@mui/material';

const ReviewList = ({ reviews }) => {

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
                                secondary={review.comment}
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
