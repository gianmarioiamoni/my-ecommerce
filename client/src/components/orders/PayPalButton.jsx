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
                                value: amountNumber.toFixed(2), // Assicurati che ci siano sempre due decimali
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
                    console.error("Errore durante il pagamento: ", err);
                }
            }).render(paypalRef.current);
            isButtonRendered.current = true;
        }
    }, [amountNumber, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default PayPalButton;




