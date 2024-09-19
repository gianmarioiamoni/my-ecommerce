import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * This component is a Dialog that allows the user to input a new wishlist name
 * and create a new wishlist.
 *
 * @param {boolean} openCreateDialog - Whether the dialog is open or not
 * @param {function} handleCloseCreateDialog - Function that closes the dialog
 * @param {string} newWishlistName - The current name of the new wishlist
 * @param {function} setNewWishlistName - Function that updates the newWishlistName state
 * @param {function} handleCreateNewWishlist - Function that creates the new wishlist
 *
 * @return {React.Component} The CreateNewWishlistDialog component
 */
const CreateNewWishlistDialog = ({
    openCreateDialog,
    handleCloseCreateDialog,
    newWishlistName,
    setNewWishlistName,
    handleCreateNewWishlist,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
            <DialogTitle>{t('wishlist.createTitle')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('wishlist.createDescription')}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('wishlist.nameLabel')}
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseCreateDialog} color="primary">
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateNewWishlist} color="primary">
                    {t('wishlist.createButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateNewWishlistDialog;

