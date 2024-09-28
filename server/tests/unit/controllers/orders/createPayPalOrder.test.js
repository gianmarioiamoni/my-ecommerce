import request from 'supertest';
import express from 'express';
// import { createPayPalOrder } from '../../../../controllers/orders.js';
import Order from '../../../../models/Order.js';
import paypal from '@paypal/checkout-server-sdk';

jest.mock('@paypal/checkout-server-sdk');
jest.mock('../../../../models/Order.js');

const app = express();
app.use(express.json());
app.post('/paypal-order', createPayPalOrder);

const createPayPalClient = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing");
        throw new Error("Missing PayPal credentials");
    }

    // Create the PayPal client
    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    return client;
};


describe('createPayPalOrder', () => {
    let reqBody;

    beforeEach(() => {
        reqBody = {
            shippingData: {},
            paymentMethod: 'paypal',
            cartItems: [{ _id: 'product1', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: 'PAYPAL123' },
            userId: 'user123'
        };
    });

    it('should return success when order is already captured', async () => {
        Order.findOne.mockResolvedValue({ paypalOrderId: reqBody.paymentDetails.id });
        const res = await request(app).post('/paypal-order').send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
    });

    it('should create a new order and return success', async () => {
        Order.findOne.mockResolvedValue(null);
        const paypalClient = {
            execute: jest.fn().mockResolvedValue({ result: { status: 'COMPLETED' } })
        };
        paypal.createPayPalClient.mockReturnValue(paypalClient);
        Order.prototype.save.mockResolvedValue({ _id: 'order123', products: [{ product: 'product1', quantity: 2 }] });
        const res = await request(app).post('/paypal-order').send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Order.prototype.save).toHaveBeenCalled();
    });

    it('should return error when PayPal payment is not successful', async () => {
        Order.findOne.mockResolvedValue(null);
        const paypalClient = {
            execute: jest.fn().mockResolvedValue({ result: { status: 'FAILED' } })
        };
        paypal.createPayPalClient.mockReturnValue(paypalClient);
        const res = await request(app).post('/paypal-order').send(reqBody);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('error');
    });

    it('should return error when ORDER_ALREADY_CAPTURED', async () => {
        Order.findOne.mockResolvedValue(null);
        const paypalClient = {
            execute: jest.fn().mockRejectedValue({
                response: {
                    statusCode: 422,
                    result: {
                        details: [{ issue: 'ORDER_ALREADY_CAPTURED' }]
                    }
                }
            })
        };
        paypal.createPayPalClient.mockReturnValue(paypalClient);
        const res = await request(app).post('/paypal-order').send(reqBody);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Order already captured');
    });

    it('should return error when other error occurs', async () => {
        Order.findOne.mockResolvedValue(null);
        const paypalClient = {
            execute: jest.fn().mockRejectedValue(new Error('Test error'))
        };
        paypal.createPayPalClient.mockReturnValue(paypalClient);
        const res = await request(app).post('/paypal-order').send(reqBody);
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('An error occurred while capturing the order');
    });
});
