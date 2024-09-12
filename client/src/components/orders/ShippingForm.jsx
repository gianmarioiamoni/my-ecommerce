import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { getAddresses } from '../../services/usersServices';
import { useTranslation } from 'react-i18next';

const ShippingForm = ({ userId, nextStep }) => {
    const [shippingData, setShippingData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const result = await getAddresses(userId);
                if (!result.error && result.length > 0) {
                    setAddresses(result);

                    const defaultAddress = result.find(address => address.isDefault);
                    if (defaultAddress) {
                        setShippingData({
                            fullName: defaultAddress.name,
                            address: defaultAddress.addressLine1 + ' ' + defaultAddress.addressLine2,
                            city: defaultAddress.city,
                            postalCode: defaultAddress.zipCode,
                            country: defaultAddress.country,
                        });
                        setSelectedAddress(defaultAddress._id);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchAddresses();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingData({
            ...shippingData,
            [name]: value,
        });
    };

    const handleAddressChange = (e) => {
        const addressId = e.target.value;
        setSelectedAddress(addressId);

        const selectedAddr = addresses.find(address => address._id === addressId);
        if (selectedAddr) {
            setShippingData({
                fullName: selectedAddr.name,
                address: selectedAddr.addressLine1 + ' ' + selectedAddr.addressLine2,
                city: selectedAddr.city,
                postalCode: selectedAddr.zipCode,
                country: selectedAddr.country,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep(shippingData);
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={4} mb={4}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    {t('shippingForm.title')}
                </Typography>

                {addresses.length > 0 && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="address-select-label">{t('shippingForm.selectSavedAddress')}</InputLabel>
                        <Select
                            labelId="address-select-label"
                            value={selectedAddress}
                            onChange={handleAddressChange}
                        >
                            {addresses.map((address) => (
                                <MenuItem key={address._id} value={address._id}>
                                    {address.name} - {address.addressLine1}, {address.city}, {address.country}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
                    <TextField
                        name="fullName"
                        label={t('shippingForm.fullName')}
                        fullWidth
                        margin="normal"
                        value={shippingData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="address"
                        label={t('shippingForm.address')}
                        fullWidth
                        margin="normal"
                        value={shippingData.address}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="city"
                        label={t('shippingForm.city')}
                        fullWidth
                        margin="normal"
                        value={shippingData.city}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="postalCode"
                        label={t('shippingForm.postalCode')}
                        fullWidth
                        margin="normal"
                        value={shippingData.postalCode}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="country"
                        label={t('shippingForm.country')}
                        fullWidth
                        margin="normal"
                        value={shippingData.country}
                        onChange={handleChange}
                        required
                    />
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" color="primary">
                            {t('shippingForm.next')}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default ShippingForm;

