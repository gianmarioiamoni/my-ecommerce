import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

/**
 * A component that renders a list of the user's wishlists.
 * The component allows the user to create a new wishlist, edit the name of an existing wishlist,
 * remove a product from a wishlist, and delete a wishlist.
 * @function WishlistPage
 * @returns {JSX.Element} The rendered component.
 */
const WishlistPage = () => {
    const { t } = useTranslation();
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

    /**
     * Handles the change of the wishlist name.
     * @param {Object} wishlist - The wishlist object.
     */
    const handleEditName = (wishlist) => {
        const newName = prompt(t('wishListPage.prompt.editName'), wishlist.name);
        if (newName && newName !== wishlist.name) {
            handleEditWishlistName(wishlist._id, newName);
        }
    };

    /**
     * Handles the open event of the delete dialog.
     * @param {Object} wishlist - The wishlist object.
     */
    const handleOpenDeleteDialog = (wishlist) => {
        setWishlistToDelete(wishlist);
        setOpenDeleteDialog(true);
    };

    /**
     * Handles the close event of the delete dialog.
     */
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setWishlistToDelete(null);
    };

    /**
     * Handles the confirm event of the delete dialog.
     */
    const handleConfirmDelete = () => {
        if (wishlistToDelete) {
            handleDeleteWishlist(wishlistToDelete._id);
        }
        handleCloseDeleteDialog();
    };

    /**
     * Handles the open event of the create dialog.
     */
    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    /**
     * Handles the close event of the create dialog.
     */
    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewWishlistName('');
    };

    /**
     * Handles the confirm event of the create dialog.
     */
    const handleConfirmCreate = () => {
        if (newWishlistName.trim()) {
            handleCreateWishlist(newWishlistName);
        }
        handleCloseCreateDialog();
    };

    return (
        <Container sx={{ marginTop: 4, maxWidth: 'md' }}>
            <Typography variant="h4" gutterBottom align="center">
                {t('wishListPage.title')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                <Button variant="contained" onClick={handleOpenCreateDialog}>
                    {t('wishListPage.button.create')}
                </Button>
            </Box>

            <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                {wishlists?.map(wishlist => (
                    <Paper key={wishlist._id} sx={{ marginBottom: 2, padding: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                                {wishlist.name}
                            </Typography>
                            <Box>
                                <Tooltip title={t('wishListPage.tooltip.edit')}>
                                    <IconButton onClick={() => handleEditName(wishlist)} size="medium" sx={{ marginRight: 1 }}>
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('wishListPage.tooltip.delete')}>
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
                                        <Tooltip title={t('wishListPage.tooltip.addToCart')}>
                                            <IconButton onClick={() => addToCart(product, user)} size="small">
                                                <AddShoppingCartIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('wishListPage.tooltip.removeFromWishlist')}>
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

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>{t('wishListPage.dialog.deleteTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('wishListPage.dialog.deleteText', { name: wishlistToDelete?.name })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        {t('wishListPage.dialog.cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        {t('wishListPage.dialog.delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>{t('wishListPage.dialog.createTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('wishListPage.dialog.createText')}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('wishListPage.dialog.wishlistName')}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newWishlistName}
                        onChange={(e) => setNewWishlistName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog} color="primary">
                        {t('wishListPage.dialog.cancel')}
                    </Button>
                    <Button onClick={handleConfirmCreate} color="primary">
                        {t('wishListPage.dialog.create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default WishlistPage;

