import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    List, ListItem, ListItemText,
    Box,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const AddressesList = ({ addresses, setAddresses, handleDeleteClick }) => {
    const { t } = useTranslation();

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

    return (
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
    )
};

export default AddressesList;