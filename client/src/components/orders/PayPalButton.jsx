import React, { useEffect, useRef } from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
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
                    console.error("Error during payment: ", err);
                }
            }).render(paypalRef.current);
            isButtonRendered.current = true;
        }
    }, [amountNumber, onSuccess]);

    return <div ref={paypalRef} style={{ marginTop: '30px' }}></div>;
};

export default PayPalButton;




