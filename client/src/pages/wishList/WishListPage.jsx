import React from 'react';
import { useWishlist } from '../../contexts/WishListContext';
import { Link } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Button } from '@mui/material';

const WishlistPage = () => {
    const { wishlists, handleCreateWishlist, handleRemoveFromWishlist } = useWishlist();

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Your Wishlists
            </Typography>

            <Button variant="contained" onClick={() => {
                const wishlistName = prompt("Enter the name of your new wishlist:");
                if (wishlistName) {
                    handleCreateWishlist(wishlistName);
                }
            }}>
                Create New Wishlist
            </Button>

            <List>
                {wishlists.map(wishlist => (
                    <ListItem key={wishlist._id}>
                        <ListItemText
                            primary={wishlist.name}
                            secondary={wishlist.products.map(p => p.name).join(', ')}
                        />
                        <Button onClick={() => handleRemoveFromWishlist(wishlist._id)}>
                            Remove Product
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default WishlistPage;
