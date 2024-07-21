import express from 'express';
import paypal from '@paypal/checkout-server-sdk';

const router = express.Router();

const createPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    return client;
};

router.post('/', async (req, res) => {
    const { shippingData, paymentMethod, cartItems, totalAmount, paymentDetails } = req.body;

    const paypalClient = createPayPalClient();

    if (paymentMethod === 'paypal') {
        const request = new paypal.orders.OrdersCaptureRequest(paymentDetails.orderID);
        request.requestBody({});

        try {
            const capture = await paypalClient.execute(request);
            if (capture.result.status === 'COMPLETED') {
                // Logica per salvare l'ordine nel database
                res.status(200).json({ status: 'Order completed successfully' });
            } else {
                res.status(400).json({ status: 'Order not completed' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while capturing the order' });
        }
    } else {
        // Logica per altri metodi di pagamento (ad es. carta di credito)
    }
});

export default router;
