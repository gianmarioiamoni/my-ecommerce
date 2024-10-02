import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Container, Box,
    Typography,
    Tabs, Tab
} from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';
import { getAddresses, deleteAddress, getPaymentMethods, deletePaymentMethod } from '../../services/usersServices';

import AddressesForm from '../../components/users/AddressesForm';
import AddressesList from '../../components/users/AddressesList';
import PaymentsForm from '../../components/users/PaymentsForm';
import PaymentsList from '../../components/users/PaymentsList';
import DeleteConfirmationDialog from '../../components/users/DeleteConfirmationDialog';

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


    // Functions to handle delete confirmation dialog
    const handleDeleteClick = (index, type) => {
        setDeleteIndex(index);
        setDeleteType(type);
        setDeleteConfirmationOpen(true);
    };


    /**
     * Handles the confirmation of deletion of an address or payment method
     * The function to be called depends on the type of the item to be deleted
     */
    const handleDeleteConfirm = () => {
        if (deleteType === 'address') {
            // Remove the address from the state
            handleRemoveAddress(deleteIndex);
        } else if (deleteType === 'payment') {
            // Remove the payment method from the state
            handleRemovePaymentMethod(deleteIndex);
        }
        // Close the delete confirmation dialog
        setDeleteConfirmationOpen(false);
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
            
            {/* Addresses tab */}
            {tabIndex === 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        {t('manageAddressesPayments.manageShippingAddresses')}
                    </Typography>

                    <AddressesForm setAddresses={setAddresses} />
                    <AddressesList addresses={addresses} setAddresses={setAddresses} handleDeleteClick={handleDeleteClick} />
                </Box>
            )}

            {/* Payments tab */}
            {tabIndex === 1 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        {t('manageAddressesPayments.managePaymentMethods')}
                    </Typography>

                    <PaymentsForm setPayments={setPayments} />
                    <PaymentsList payments={payments} setPayments={setPayments} handleDeleteClick={handleDeleteClick} />
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                deleteConfirmationOpen={deleteConfirmationOpen}
                setDeleteConfirmationOpen={setDeleteConfirmationOpen}
                handleDeleteConfirm={handleDeleteConfirm}
                />
        </Container>
    );
};

export default ManageAddressesPayments;



