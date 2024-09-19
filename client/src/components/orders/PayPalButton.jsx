import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * The PayPal button component
 * @param {Object} props The component props
 * @param {number} props.amount The amount of the order
 * @param {Function} props.onSuccess The function to be called when the payment is successful
 */
const PayPalButton = ({ amount, onSuccess }) => {
    const { t } = useTranslation();
    // The reference to the PayPal button
    const paypalRef = useRef(null);
    // A flag to track if the button has been rendered
    const isButtonRendered = useRef(false);

    // The amount of the order as a number, with 2 decimal places
    const amountNumber = parseFloat(amount).toFixed(2);

    useEffect(() => {
        // Render the PayPal button only if the amount is greater than 0
        if (!isButtonRendered.current && amountNumber > 0) {
            window.paypal.Buttons({
                /**
                 * Function to create the order
                 * @param {Object} data The data for creating the order
                 * @param {Object} actions The actions object
                 * @return {Object} The order object
                 */
                createOrder: (data, actions) => {
                    return actions.order.create({
                        // The purchase units array
                        purchase_units: [{
                            // The amount object
                            amount: {
                                // The value of the order
                                value: amountNumber,
                            },
                        }],
                    });
                },
                // Function to be called when the payment is approved
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        onSuccess(details);
                    });
                },
                // Function to be called if there is an error during the payment
                onError: (err) => {
                    console.error(t('paypal.error_during_payment'), err);
                }
            }).render(paypalRef.current);
            isButtonRendered.current = true;
        }
    }, [amountNumber, onSuccess, t]);

    return <div ref={paypalRef} style={{ marginTop: '30px' }}></div>;
};

export default PayPalButton;




