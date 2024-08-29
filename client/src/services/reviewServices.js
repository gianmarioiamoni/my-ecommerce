import axios from 'axios';
import serverURL from '../config/serverURL';
import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


export const createReview = async (productId, review) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/products/${productId}/reviews`, review);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};


export const getProductReviews = async (productId) => {
    try {
        const response = await axios.get(`${serverURL}/products/${productId}/reviews`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const hasPurchasedProduct = async (userId, productId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders/history/${userId}`);

        // response.data is an object with an array of orders
        const orders = response.data.orders;

        // verify if orders is an array
        if (!Array.isArray(orders)) {
            console.error('Expected an array of orders, but received:', orders);
            return false; 
        }

        // verify if the productId is in any of the orders
        const result = orders.some(order =>
            order.products.some(p => p.product._id.toString() === productId));
        
        return result;

    } catch (error) {
        console.error('Error checking product purchase:', error);
        throw error;
    }
};
