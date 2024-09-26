import React, { useState, useContext } from "react";

import {
    Grid,
    TextField,
    Button,
    Box
} from "@mui/material";
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../contexts/AuthContext';

import { addAddress } from "../../services/usersServices";

const AddressesForm = ({setAddresses}) => {
    const { t } = useTranslation();

    const { user } = useContext(AuthContext);

    const [addressForm, setAddressForm] = useState({ // Form data for new address
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });


    /**
     * Handles addition of new address
     * @param {Object} newAddress - New address data
     */
    const handleAddAddress = async (newAddress) => {
        try {
            const response = await addAddress(user.id, newAddress);
            // setAddresses([...addresses, response]);
            setAddresses((prev) => [...prev, response]);
        } catch (error) {
            console.error(t('manageAddressesPayments.errors.addAddressError'), error);
        }
    };

    /**
     * Handles change of address form data
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
     */
    const handleAddressChange = (e) => {
        // setAddressForm({
        //     ...addressForm,
        //     [e.target.name]: e.target.value
        // });
        setAddressForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddAddress(addressForm);
        setAddressForm({
            name: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mb: 4 }}>
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
    )
}

export default AddressesForm;