import React from "react";

import {
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

const PaymentsList = ({ payments, setPayments, handleDeleteClick }) => {
    const { t } = useTranslation();

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


    return (
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
    )
};

export default PaymentsList;