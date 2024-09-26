import React, { useContext} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

import { useTranslation } from 'react-i18next';

const DeleteConfirmationDialog = ({
    deleteConfirmationOpen,
    setDeleteConfirmationOpen,
    handleDeleteConfirm }) => {

    const { t } = useTranslation();


    return (
        <Dialog
            open={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
            aria-labelledby="delete-confirmation-dialog-title"
            aria-describedby="delete-confirmation-dialog-description"
        >
            <DialogTitle id="delete-confirmation-dialog-title">
                {t('manageAddressesPayments.dialogs.confirmDeletion')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-confirmation-dialog-description">
                    {t('manageAddressesPayments.dialogs.confirmDeletionText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                    {t('manageAddressesPayments.buttons.cancel')}
                </Button>
                <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                    {t('manageAddressesPayments.buttons.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default DeleteConfirmationDialog;