import React, { useEffect } from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
    useEffect(() => {
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
        }).render('#paypal-button-container');
    }, [amount, onSuccess]);

    return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
