import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

const CreateNewWishlistDialog = ({
    openCreateDialog,
    handleCloseCreateDialog,
    newWishlistName,
    setNewWishlistName,
    handleCreateNewWishlist,
}) => (
    <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create New Wishlist</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please enter a name for your new wishlist.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Wishlist Name"
                type="text"
                fullWidth
                variant="standard"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseCreateDialog} color="primary">
                Cancel
            </Button>
            <Button onClick={handleCreateNewWishlist} color="primary">
                Create
            </Button>
        </DialogActions>
    </Dialog>
);

export default CreateNewWishlistDialog;
