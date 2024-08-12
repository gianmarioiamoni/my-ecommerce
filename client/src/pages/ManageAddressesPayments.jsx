import React, { useState } from 'react';
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

const ManageAddressesPayments = () => {
    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);

    const [addressForm, setAddressForm] = useState({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [paymentForm, setPaymentForm] = useState({
        cardType: '',
        last4Digits: '',
        expiryDate: '',
    });

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [deleteType, setDeleteType] = useState(null);

    const [tabIndex, setTabIndex] = useState(0);

    // Address management functions
    const addAddress = (newAddress) => {
        setAddresses([...addresses, newAddress]);
    };

    const removeAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
    };

    const setDefaultAddress = (index) => {
        const updatedAddresses = addresses.map((address, i) => ({
            ...address,
            isDefault: i === index,
        }));
        setAddresses(updatedAddresses);
    };

    // Payment method management functions
    const addPaymentMethod = (newPayment) => {
        setPayments([...payments, newPayment]);
    };

    const removePaymentMethod = (index) => {
        const updatedPayments = payments.filter((_, i) => i !== index);
        setPayments(updatedPayments);
    };

    const setDefaultPaymentMethod = (index) => {
        const updatedPayments = payments.map((payment, i) => ({
            ...payment,
            isDefault: i === index,
        }));
        setPayments(updatedPayments);
    };

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        });
    };

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
            removeAddress(deleteIndex);
        } else if (deleteType === 'payment') {
            removePaymentMethod(deleteIndex);
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
                Manage Your Account
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="address-payment-tabs">
                <Tab label="Shipping Addresses" />
                <Tab label="Payment Methods" />
            </Tabs>

            {tabIndex === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        Manage Shipping Addresses
                    </Typography>

                    <Box component="form" onSubmit={(e) => {
                        e.preventDefault();
                        addAddress({ ...addressForm, isDefault: addresses.length === 0 });
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
                                    label="Name"
                                    name="name"
                                    value={addressForm.name}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address Line 1"
                                    name="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address Line 2"
                                    name="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={handleAddressChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    name="city"
                                    value={addressForm.city}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State/Province"
                                    name="state"
                                    value={addressForm.state}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Zip Code"
                                    name="zipCode"
                                    value={addressForm.zipCode}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Country"
                                    name="country"
                                    value={addressForm.country}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Add Address
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
                                            <Tooltip title="Delete Address">
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(index, 'address')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Set as Default Address">
                                                <IconButton edge="end" aria-label="set default" onClick={() => setDefaultAddress(index)}>
                                                    <CheckIcon color={address.isDefault ? "primary" : "inherit"} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={`${address.name}, ${address.addressLine1}`}
                                        secondary={`${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
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
                        Manage Payment Methods
                    </Typography>
                    <Box component="form" onSubmit={(e) => {
                        e.preventDefault();
                        addPaymentMethod({ ...paymentForm, isDefault: payments.length === 0 });
                        setPaymentForm({
                            cardType: '',
                            last4Digits: '',
                            expiryDate: '',
                        });
                    }} sx={{ mb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Card Type"
                                    name="cardType"
                                    value={paymentForm.cardType}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Last 4 Digits"
                                    name="last4Digits"
                                    value={paymentForm.last4Digits}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Expiry Date (MM/YY)"
                                    name="expiryDate"
                                    value={paymentForm.expiryDate}
                                    onChange={handlePaymentChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Add Payment Method
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
                                            <Tooltip title="Delete Payment Method">
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(index, 'payment')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Set as Default Payment Method">
                                                <IconButton edge="end" aria-label="set default" onClick={() => setDefaultPaymentMethod(index)}>
                                                    <CheckIcon color={payment.isDefault ? "primary" : "inherit"} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={`${payment.cardType} **** ${payment.last4Digits}`}
                                        secondary={`Expiry: ${payment.expiryDate}`}
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>

                </Box>
            )
            }

            <Dialog
                open={deleteConfirmationOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-confirmation-dialog"
            >
                <DialogTitle id="delete-confirmation-dialog">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this {deleteType === 'address' ? 'address' : 'payment method'}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
} 



export default ManageAddressesPayments;


