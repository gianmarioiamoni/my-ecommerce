import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Box,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tabs,
    Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import { AuthContext } from '../../contexts/AuthContext';
import { getAddresses, addAddress, deleteAddress, getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../../services/usersServices';
import { useTranslation } from 'react-i18next';

/**
 * Component to manage user's addresses and payment methods.
 *
 * @returns {JSX.Element}
 */
const ManageAddressesPayments = () => {
    const { t } = useTranslation();  // Hook per la traduzione
    const [addresses, setAddresses] = useState([]); // List of user's addresses
    const [payments, setPayments] = useState([]); // List of user's payment methods

    const { user } = useContext(AuthContext); // User object

    const [addressForm, setAddressForm] = useState({ // Form data for new address
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [paymentForm, setPaymentForm] = useState({ // Form data for new payment method
        cardType: '',
        last4Digits: '',
        cardNumber: '',
        expiryDate: '',
    });

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // Whether the delete confirmation dialog is open
    const [deleteIndex, setDeleteIndex] = useState(null); // Index of the address or payment method to be deleted
    const [deleteType, setDeleteType] = useState(null); // Type of the item to be deleted (address or payment)

    const [tabIndex, setTabIndex] = useState(0); // Current tab index

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedAddresses = await getAddresses(user.id);
                const fetchedPayments = await getPaymentMethods(user.id);
                setAddresses(fetchedAddresses);
                setPayments(fetchedPayments);
            } catch (error) {
                console.error(t('manageAddressesPayments.errors.fetchingDataError'), error);
            }
        };

        fetchData();
    }, [user.id, t]);

    /**
     * Handles addition of new address
     * @param {Object} newAddress - New address data
     */
    const handleAddAddress = async (newAddress) => {
        try {
            const response = await addAddress(user.id, newAddress);
            setAddresses([...addresses, response]);
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.addAddressError'), error);
        }
    };

    /**
     * Handles removal of existing address
     * @param {Number} index - Index of the address to be removed
     */
    const handleRemoveAddress = async (index) => {
        try {
            await deleteAddress(user.id, addresses[index]._id);
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.deleteAddressError'), error);
        }
    };

    /**
     * Handles setting of default address
     * @param {Number} index - Index of the address to be set as default
     */
    const setDefaultAddress = (index) => {
        const updatedAddresses = addresses.map((address, i) => ({
            ...address,
            isDefault: i === index,
        }));
        setAddresses(updatedAddresses);
    };

    /**
     * Handles addition of new payment method
     * @param {Object} newPayment - New payment method data
     */
    const handleAddPaymentMethod = async (newPayment) => {
        try {
            const cardNumber = newPayment.cardNumber;
            const last4Digits = cardNumber.slice(cardNumber.length - 4);
            newPayment.last4Digits = last4Digits;
            const response = await addPaymentMethod(user.id, newPayment);
            setPayments([...payments, response]);
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.addPaymentError'), error);
        }
    };

    /**
     * Handles removal of existing payment method
     * @param {Number} index - Index of the payment method to be removed
     */
    const handleRemovePaymentMethod = async (index) => {
        try {
            await deletePaymentMethod(user.id, payments[index]._id);
            setPayments(payments.filter((_, i) => i !== index));
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.deletePaymentError'), error);
        }
    };

    /**
     * Handles setting of default payment method
     * @param {Number} index - Index of the payment method to be set as default
     */
    const setDefaultPaymentMethod = (index) => {
        const updatedPayments = payments.map((payment, i) => ({
            ...payment,
            isDefault: i === index,
        }));
        setPayments(updatedPayments);
    };

    /**
     * Handles change of address form data
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
     */
    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handles change of payment form data
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
     */
    const handlePaymentChange = (e) => {
        setPaymentForm({
            ...paymentForm,
            [e.target.name]: e.target.value
        });
    };

    // Functions to handle delete confirmation dialog
    const handleDeleteClick = (index, type) => {
        setDeleteIndex(index);
        setDeleteType(type);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteType === 'address') {
            handleRemoveAddress(deleteIndex);
        } else if (deleteType === 'payment') {
            handleRemovePaymentMethod(deleteIndex);
        }
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                {t('manageAddressesPayments.manageAccount')}
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="address-payment-tabs">
                <Tab label={t('manageAddressesPayments.tabs.shippingAddresses')} />
                <Tab label={t('manageAddressesPayments.tabs.paymentMethods')} />
            </Tabs>

            {tabIndex === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        {t('manageAddressesPayments.manageShippingAddresses')}
                    </Typography>

                    <Box component="form" onSubmit={(e) => {
                        e.preventDefault();
                        handleAddAddress({ ...addressForm, isDefault: addresses.length === 0 });
                        setAddressForm({
                            name: '',
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: '',
                        });
                    }} sx={{ mb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.name')}
                                    name="name"
                                    value={addressForm.name}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.addressLine1')}
                                    name="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.addressLine2')}
                                    name="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={handleAddressChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.city')}
                                    name="city"
                                    value={addressForm.city}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.state')}
                                    name="state"
                                    value={addressForm.state}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.zipCode')}
                                    name="zipCode"
                                    value={addressForm.zipCode}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.country')}
                                    name="country"
                                    value={addressForm.country}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    {t('manageAddressesPayments.buttons.addAddress')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <List>
                        {addresses.map((address, index) => (
                            <Box key={index}>
                                <ListItem
                                    secondaryAction={
                                        <>
                                            <Tooltip title={t('manageAddressesPayments.tooltips.deleteAddress')}>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(index, 'address')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('manageAddressesPayments.tooltips.setDefaultAddress')}>
                                                <IconButton edge="end" aria-label="set-default" onClick={() => setDefaultAddress(index)}>
                                                    <CheckIcon color={address.isDefault ? 'success' : 'disabled'} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={`${address.name}, ${address.addressLine1}, ${address.city}`}
                                        secondary={address.isDefault ? t('manageAddressesPayments.labels.defaultAddress') : ''}
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        {t('manageAddressesPayments.managePaymentMethods')}
                    </Typography>

                    <Box component="form" onSubmit={(e) => {
                        e.preventDefault();
                        handleAddPaymentMethod(paymentForm);
                        setPaymentForm({
                            cardType: '',
                            last4Digits: '',
                            cardNumber: '',
                            expiryDate: '',
                        });
                    }} sx={{ mb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.cardType')}
                                    name="cardType"
                                    value={paymentForm.cardType}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.cardNumber')}
                                    name="cardNumber"
                                    value={paymentForm.cardNumber}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label={t('manageAddressesPayments.fields.expiryDate')}
                                    name="expiryDate"
                                    value={paymentForm.expiryDate}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    {t('manageAddressesPayments.buttons.addPayment')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <List>
                        {payments.map((payment, index) => (
                            <Box key={index}>
                                <ListItem
                                    secondaryAction={
                                        <>
                                            <Tooltip title={t('manageAddressesPayments.tooltips.deletePayment')}>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(index, 'payment')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('manageAddressesPayments.tooltips.setDefaultPayment')}>
                                                <IconButton edge="end" aria-label="set-default" onClick={() => setDefaultPaymentMethod(index)}>
                                                    <CheckIcon color={payment.isDefault ? 'success' : 'disabled'} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={`${payment.cardType} ****${payment.last4Digits}`}
                                        secondary={payment.isDefault ? t('manageAddressesPayments.labels.defaultPayment') : ''}
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                </Box>
            )}

            <Dialog
                open={deleteConfirmationOpen}
                onClose={handleDeleteCancel}
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
                    <Button onClick={handleDeleteCancel} color="primary">
                        {t('manageAddressesPayments.buttons.cancel')}
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        {t('manageAddressesPayments.buttons.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageAddressesPayments;



