import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


// CREDIT CARD PAYMENT

/**
 * Creates a payment intent for the given payment method and amount
 * @param {string} paymentMethodId - The id of the payment method
 * @param {number} amount - The amount to be paid
 * @return {Object} The response from the server. If the request is successful, the response will contain the payment intent id and client secret. If the request fails, the response will contain an error message.
 */
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

/**
 * Confirms a payment intent
 * @param {string} paymentIntentId - The id of the payment intent
 * @return {Object} The response from the server. If the request is successful, the response will contain the order id and a success message. If the request fails, the response will contain an error message.
 */
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

/**
 * Creates an order in the database using the PayPal payment method
 * @param {Object} orderData - The order data to be saved in the database
 * @param {string} orderData.userId - The ID of the user who made the order
 * @param {Array} orderData.products - The products in the order
 * @param {number} orderData.total - The total price of the order
 * @param {string} orderData.paymentMethod - The payment method used (PayPal)
 * @param {string} orderData.paymentStatus - The status of the payment (pending, completed, failed)
 * @return {Object} The response from the server. If the request is successful, the response will contain the order id and a success message. If the request fails, the response will contain an error message.
 */
export const createPayPalOrder = async (orderData) => {
    try {
        // Add the Authorization header with the access token
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/orders/paypal-order`, orderData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Creates an order in the database using the credit card payment method
 * @param {Object} orderData - The order data to be saved in the database
 * @param {string} orderData.userId - The ID of the user who made the order
 * @param {Array} orderData.products - The products in the order
 * @param {number} orderData.total - The total price of the order
 * @param {string} orderData.paymentMethod - The payment method used (Credit Card)
 * @param {string} orderData.paymentStatus - The status of the payment (pending, completed, failed)
 * @return {Object} The response from the server. If the request is successful, the response will contain the order id and a success message. If the request fails, the response will contain an error message.
 */
export const createCreditCardOrder = async (orderData) => {
    try {
        // Add the Authorization header with the access token
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/orders/credit-card-order`, orderData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        // Return the error message from the server
        return { error: error.response.data.error };
    }
}


/**
 * Fetches the order history for the given user
 * @param {string} userId The id of the user to fetch the order history for
 * @param {Object} options The options to customize the request
 * @param {number} [options.page=1] The page number to fetch
 * @param {number} [options.limit=10] The number of orders to fetch per page
 * @param {string} [options.sort='createdAt'] The field to sort the orders by
 * @param {string} [options.order='desc'] The order in which to sort the orders
 * @param {string} [options.search=''] The search query to filter the orders
 * @param {string} [options.startDate] The start date of the range of orders to fetch
 * @param {string} [options.endDate] The end date of the range of orders to fetch
 * @return {Object} The response from the server. If the request is successful, the response will contain the order history. If the request fails, the response will contain an error message.
 */
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

/**
 * Fetches all orders from the server
 * @return {Array} The array of orders
 * @throws {Error} If there is an error fetching the orders
 */
export const getAllOrders = async () => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders`);
        // Verify that the response is an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

/**
 * Updates the status of an order
 * @param {string} orderId - The ID of the order
 * @param {string} status - The new status of the order
 * @return {Object} The response from the server. If the request is successful, the response will contain the order with the updated status. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error updating the order status
 */
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

/**
 * Fetches all users with orders from the server
 * @return {Array} The array of users with orders
 * @throws {Error} If there is an error fetching the users with orders
 */
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

/**
 * Checks if an order is delivered
 * @param {string} productId - The ID of the product in the order
 * @param {string} userId - The ID of the user who made the order
 * @return {boolean} True if the order is delivered, false otherwise
 * @throws {Error} If there is an error checking if the order is delivered
 */
export const isOrderDelivered = async (userId, productId) => {
    console.log("isOrderDelivered() - userId:", userId, "productId:", productId);

    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders/delivered/${productId}/${userId}`);
        // If the response status is 200, the order is delivered
        // Otherwise, the order is not delivered
        return response.status === 200;
    } catch (error) {
        console.error('Error checking if order is delivered:', error);
        throw error;
    }
};



