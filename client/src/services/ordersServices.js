import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


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
        // const token = localStorage.getItem('token');
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        initAuthorizationHeader();
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
        initAuthorizationHeader();
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

    initAuthorizationHeader();
    const response = await axios.get(`${serverURL}/orders/history/${userId}`, {
        params: { page, limit, sort, order, search, startDate, endDate }
    });

    return response.data;
}; 

export const getAllOrders = async () => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        initAuthorizationHeader();
        const response = await axios.patch(`${serverURL}/orders/update-order-status/${orderId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const getAllUsersWithOrders = async () => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders/users-with-orders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users with orders:', error);
        throw error;
    }
};

export const isOrderDelivered = async (productId, userId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders/delivered/${productId}/${userId}`);
        // if returned status is = 200 return true
        // else return false
        return response.data.status === 200;
    } catch (error) {
        console.error('Error checking if order is delivered:', error);
        throw error;
    }
};



