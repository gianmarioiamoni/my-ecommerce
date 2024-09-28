import sinon from 'sinon';
import expect from 'expect';
import stripe from 'stripe';
import Order from '../../../../models/Order'; 
import { createCreditCardOrder } from '../../../../controllers/orders';



describe('createCreditCardOrder', () => {
    let req, res, stripeClient, paymentIntent;

    beforeEach(() => {
        req = { body: {} };
        res = { status: sinon.stub(), json: sinon.stub() };
        stripeClient = sinon.stub(new stripe('test_secret_key'));
        paymentIntent = { id: 'test_payment_intent_id', status: 'succeeded' };
    });

    it('should create a new order with valid payment intent', async () => {
        req.body = {
            paymentMethod: 'credit-card',
            cartItems: [{ _id: 'test_product_id', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: paymentIntent.id },
            userId: 'test_user_id',
        };
        stripeClient.paymentIntents.retrieve.resolves(paymentIntent);
        const savedOrder = { _id: 'test_order_id' };
        sinon.stub(Order, 'findOne').resolves(null);
        sinon.stub(Order.prototype, 'save').resolves(savedOrder);
        await createCreditCardOrder(req, res);
        expect(res.status.calledWith(200)).toBe(true);
        expect(res.json.calledWith({ status: 'success' })).toBe(true);
        Order.findOne.restore();
        Order.prototype.save.restore();
    });

    it('should return success response if order already exists in database', async () => {
        req.body = {
            paymentMethod: 'credit-card',
            cartItems: [{ _id: 'test_product_id', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: paymentIntent.id },
            userId: 'test_user_id',
        };
        const retrieveStub = sinon.stub(stripeClient.paymentIntents, 'retrieve');
        retrieveStub.resolves(paymentIntent);
        stripeClient.paymentIntents.retrieve.resolves(paymentIntent);
        const existingOrder = { _id: 'test_order_id' };
        sinon.stub(Order, 'findOne').resolves(existingOrder);
        await createCreditCardOrder(req, res);
        expect(res.status.calledWith(200)).toBe(true);
        expect(res.json.calledWith({ status: 'success' })).toBe(true);
        Order.findOne.restore();
    });

    it('should return error response if payment intent is not succeeded', async () => {
        req.body = {
            paymentMethod: 'credit-card',
            cartItems: [{ _id: 'test_product_id', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: paymentIntent.id },
            userId: 'test_user_id',
        };
        paymentIntent.status = 'failed';
        stripeClient.paymentIntents.retrieve.resolves(paymentIntent);
        await createCreditCardOrder(req, res);
        expect(res.status.calledWith(400)).toBe(true);
        expect(res.json.calledWith({ status: 'error' })).toBe(true);
    });

    it('should return error response if payment method is unsupported', async () => {
        req.body = {
            paymentMethod: 'unsupported-method',
            cartItems: [{ _id: 'test_product_id', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: paymentIntent.id },
            userId: 'test_user_id',
        };
        await createCreditCardOrder(req, res);
        expect(res.status.calledWith(400)).toBe(true);
        expect(res.json.calledWith({ error: 'Unsupported payment method' })).toBe(true);
    });

    it('should handle error during Stripe payment intent retrieval', async () => {
        req.body = {
            paymentMethod: 'credit-card',
            cartItems: [{ _id: 'test_product_id', quantity: 2 }],
            totalAmount: 100,
            paymentDetails: { id: paymentIntent.id },
            userId: 'test_user_id',
        };
        stripeClient.paymentIntents.retrieve.rejects(new Error('Test error'));
        await createCreditCardOrder(req, res);
        expect(res.status.calledWith(500)).toBe(true);
        expect(res.json.calledWith({ error: 'An error occurred while retrieving the payment intent' })).toBe(true);
    });
});