import axios from 'axios';

import serverURL from '../config/serverURL';

// CREDIT CARD PAYMENT
export const createPaymentIntent = async (paymentMethodId, amount) => {
    try {
        const response = await axios.post(`${serverURL}/orders/create-payment-intent`, {
            paymentMethodId: paymentMethodId,
            amount: parseFloat(amount)
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;

    } catch (error) {
        return { error: response.data.error };
    }
}

export const confirmPaymentIntent = async (paymentIntentId) => {

    try {
        const response = await axios.post(`${serverURL}/orders/confirm-payment-intent`, {
            paymentIntentId: paymentIntentId
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;

    } catch (error) {
        return { error: response.data.error };
    }
}

// CREATE ORDER IN DB
export const createPayPalOrder = async (orderData) => {
    try {
        const response = axios.post(`${serverURL}/orders/paypal-order`, orderData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const createCreditCardOrder = async (orderData) => {
    try {
        const response = axios.post(`${serverURL}/orders/credit-card-order`, orderData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}


export const getOrderHistory = async (userId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        search = '',
        startDate,
        endDate
    } = options;


    const response = await axios.get(`${serverURL}/orders/history/${userId}`, {
        params: { page, limit, sort, order, search, startDate, endDate }
    });

    console.log("getOrderHistory() - response.data:", response.data);

    return response.data;
}; 

export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${serverURL}/orders`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(`${serverURL}/orders/update-order-status/${orderId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const getAllUsersWithOrders = async () => {
    try {
        const response = await axios.get(`${serverURL}/orders/users-with-orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users with orders:', error);
        throw error;
    }
};



