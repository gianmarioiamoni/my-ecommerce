// import paypalClient from '../config/paypal.js';
import paypal from '@paypal/checkout-server-sdk';

// const paypalClient = new paypal.core.PayPalHttpClient(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const createPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    console.log('Client ID:', clientId);
    console.log('Client Secret:', clientSecret);


    // Environment setup: Sandbox or Live
    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    // Uncomment the following line for live environment
    // let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

    let client = new paypal.core.PayPalHttpClient(environment);

    return client;
    
};




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
        const paypalClient = createPayPalClient();
        
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
    console.log('Order ID:', orderID);

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const paypalClient = createPayPalClient();

        console.log('Attempting to capture order with PayPal client:', paypalClient);
        const capture = await paypalClient.execute(request);
        console.log('Order capture successful:', capture);
        res.json({ status: capture.result.status });
    } catch (error) {
        console.error('Error capturing order:', error);
        res.status(500).json({ error: 'An error occurred while capturing the order' });
    }
};
