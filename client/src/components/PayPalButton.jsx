import React, { useEffect, useRef } from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
    const paypalRef = useRef(null);
    const isButtonRendered = useRef(false);

    useEffect(() => {
        if (!isButtonRendered.current) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount, // L'importo totale da pagare
                            },
                        }],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        onSuccess(details); // Gestisci il successo del pagamento
                    });
                },
                onError: (err) => {
                    console.error("Errore durante il pagamento: ", err);
                }
            }).render(paypalRef.current);
            isButtonRendered.current = true;
        }
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default PayPalButton;

