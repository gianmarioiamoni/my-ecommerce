import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

