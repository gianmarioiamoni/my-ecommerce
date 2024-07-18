import paypalClient from '../config/paypal.js';
import paypal from '@paypal/checkout-server-sdk';

// Create an order
export const createOrder = async (req, res) => {
    const { total } = req.body;
    console.log('Total:', total);

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: total,
                },
            },
        ],
    });

    try {
        const order = await paypalClient.execute(request);
        console.log('Order created:', order.result.id);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order' });
    }
};

// Capture an order
export const captureOrder = async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await paypalClient.execute(request);
        res.json({ status: capture.result.status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while capturing the order' });
    }
};
