import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getAddresses } from '../../services/usersServices';

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

    // Get previously saved addresses for the user when the component mounts
    useEffect(() => {
        const fetchAddresses = async () => {
            const result = await getAddresses(userId);
            if (!result.error && result.length > 0) {
                setAddresses(result);

                // Find the default address
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

        // Find the selected address in the addresses array and set it as the shipping data 
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
        // Pass shipping data to the next step
        nextStep(shippingData);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Shipping Details
            </Typography>

            {/* Predefined shipping address selection dropdown menu */}
            {addresses.length > 0 && (
                <FormControl fullWidth margin="normal" style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <InputLabel id="address-select-label">Select a Saved Address</InputLabel>
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
            
            {/* Shipping Data Form */}
            <form onSubmit={handleSubmit}>
                <TextField
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    value={shippingData.fullName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    margin="normal"
                    value={shippingData.address}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="city"
                    label="City"
                    fullWidth
                    margin="normal"
                    value={shippingData.city}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="postalCode"
                    label="Postal Code"
                    fullWidth
                    margin="normal"
                    value={shippingData.postalCode}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="country"
                    label="Country"
                    fullWidth
                    margin="normal"
                    value={shippingData.country}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Next
                </Button>
            </form>
        </Container>
    );
};

export default ShippingForm;
