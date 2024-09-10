import React, { useContext, useState } from 'react';

import {
    Container, List, ListItem, ListItemText, IconButton, Typography, Box, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useWishlist } from '../../contexts/WishListContext';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';


const WishlistPage = () => {
    const {
        wishlists,
        handleCreateWishlist,
        handleRemoveFromWishlist,
        handleEditWishlistName,
        handleDeleteWishlist
    } = useWishlist();
    
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [wishlistToDelete, setWishlistToDelete] = useState(null);
    const [newWishlistName, setNewWishlistName] = useState('');

    const handleEditName = (wishlist) => {
        const newName = prompt("Enter the new name for your wishlist:", wishlist.name);
        if (newName && newName !== wishlist.name) {
            handleEditWishlistName(wishlist._id, newName);
        }
    };

    const handleOpenDeleteDialog = (wishlist) => {
        setWishlistToDelete(wishlist);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setWishlistToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (wishlistToDelete) {
            handleDeleteWishlist(wishlistToDelete._id);
        }
        handleCloseDeleteDialog();
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewWishlistName('');
    };

    const handleConfirmCreate = () => {
        if (newWishlistName.trim()) {
            handleCreateWishlist(newWishlistName);
        }
        handleCloseCreateDialog();
    };

    return (
        <Container sx={{ marginTop: 4, maxWidth: 'md' }}>
            <Typography variant="h4" gutterBottom align="center">
                Your Wishlists
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <Button variant="contained" onClick={handleOpenCreateDialog}>
                    Create New Wishlist
                </Button>
            </Box>

            <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                {wishlists.map(wishlist => (
                    <Paper key={wishlist._id} sx={{ marginBottom: 2, padding: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                                {wishlist.name}
                            </Typography>
                            <Box>
                                <Tooltip title="Edit Wishlist Name">
                                    <IconButton onClick={() => handleEditName(wishlist)} size="medium" sx={{ marginRight: 1 }}>
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Wishlist">
                                    <IconButton onClick={() => handleOpenDeleteDialog(wishlist)} size="medium">
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <List sx={{ marginTop: 1 }}>
                            {wishlist.products.map(product => (
                                <ListItem key={product._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                                    <ListItemText primary={product.name} />

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Add to Cart">
                                            <IconButton onClick={() => addToCart(product, user)} size="small">
                                                <AddShoppingCartIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Remove from Wishlist">
                                            <IconButton onClick={() => handleRemoveFromWishlist(wishlist._id, product._id)} size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </List>

            {/* Dialog for confirming wishlist deletion */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the wishlist "{wishlistToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for creating a new wishlist */}
            <Dialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
            >
                <DialogTitle>Create New Wishlist</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of your new wishlist.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Wishlist Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newWishlistName}
                        onChange={(e) => setNewWishlistName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default WishlistPage;
