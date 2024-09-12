import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PayPalButton = ({ amount, onSuccess }) => {
    const { t } = useTranslation();
    const paypalRef = useRef(null);
    const isButtonRendered = useRef(false);

    const amountNumber = parseFloat(amount);

    useEffect(() => {
        if (!isButtonRendered.current && amountNumber > 0) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amountNumber.toFixed(2), // Guarantee 2 decimal places
                            },
                        }],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        onSuccess(details);
                    });
                },
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




