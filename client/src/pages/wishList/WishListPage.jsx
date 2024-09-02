import React, { useContext } from 'react';
import { useWishlist } from '../../contexts/WishListContext';
import { CartContext } from '../../contexts/CartContext';
import {
    Container, List, ListItem, ListItemText, IconButton, Typography, Box, Paper, Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const WishlistPage = () => {
    const { wishlists, handleCreateWishlist, handleRemoveFromWishlist, handleEditWishlistName } = useWishlist();
    const { addToCart } = useContext(CartContext);

    const handleEditName = (wishlist) => {
        const newName = prompt("Enter the new name for your wishlist:", wishlist.name);
        if (newName && newName !== wishlist.name) {
            handleEditWishlistName(wishlist._id, newName);
        }
    };

    return (
        <Container sx={{ marginTop: 4, maxWidth: 'md' }}> {/* Limitando la larghezza massima */}
            <Typography variant="h4" gutterBottom align="center">
                Your Wishlists
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <Button variant="contained" onClick={() => {
                    const wishlistName = prompt("Enter the name of your new wishlist:");
                    if (wishlistName) {
                        handleCreateWishlist(wishlistName);
                    }
                }}>
                    Create New Wishlist
                </Button>
            </Box>

            <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}> {/* Centrato e con larghezza massima */}
                {wishlists.map(wishlist => (
                    <Paper key={wishlist._id} sx={{ marginBottom: 2, padding: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                                {wishlist.name}
                            </Typography>
                            <IconButton onClick={() => handleEditName(wishlist)} size="small"> {/* Icone ridotte */}
                                <EditIcon />
                            </IconButton>
                        </Box>

                        <List sx={{ marginTop: 1 }}>
                            {wishlist.products.map(product => (
                                <ListItem key={product._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}> {/* Spaziatura ridotta */}
                                    <ListItemText primary={product.name} />

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton onClick={() => addToCart(product)} size="small"> {/* Icone ridotte */}
                                            <AddShoppingCartIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleRemoveFromWishlist(wishlist._id, product._id)} size="small"> {/* Icone ridotte */}
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </List>
        </Container>
    );
};

export default WishlistPage;


