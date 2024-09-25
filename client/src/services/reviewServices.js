import axios from 'axios';
import serverURL from '../config/serverURL';
import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


/**
 * Creates a new review for a product
 * @param {string} productId - The id of the product to review
 * @param {Object} review - The review data
 * @property {number} rating - The rating of the product (1-5)
 * @property {string} comment - The comment about the product
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the review data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error creating the review
 */
export const createReview = async (review) => {
    console.log("createReview() - review:", review);
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/reviews/product/${review.productId}`, review);
        // if status = 403 then throw error message returned by server
        if (response.status === 403) {
            // throw error
            throw new Error("You are not allowed to review this product: " + response.data.message);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
};

/**
 * Updates a review in the database
 * @param {string} reviewId - The id of the review to update
 * @param {Object} review - The review data
 * @property {number} rating - The rating of the product (1-5)
 * @property {string} comment - The comment about the product
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the review data. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error updating the review
 */
export const updateReview = async (reviewId, review) => {
    try {
        initAuthorizationHeader();
        const response = await axios.put(`${serverURL}/reviews/${reviewId}`, review);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
}

/**
 * Gets all the reviews for a product
 * @param {string} productId - The id of the product to get reviews for
 * @return {Promise<Object[]>} The response from the server. If the request is successful, the response will contain an array of review objects. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error getting the reviews
 */
export const getProductReviews = async (productId) => {
    try {
        const response = await axios.get(`${serverURL}/reviews/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Server Error");
    }
}

/**
 * Checks if a user has purchased a product
 * @param {string} userId - The id of the user to check
 * @param {string} productId - The id of the product to check
 * @return {Promise<boolean>} True if the user has purchased the product, false otherwise
 * @throws {Error} If there is an error checking the purchase
 */
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

/**
 * Checks if a user has already reviewed a product
 * @param {string} userId - The id of the user to check
 * @param {string} productId - The id of the product to check
 * @return {Promise<boolean>} True if the user has already reviewed the product, false otherwise
 * @throws {Error} If there is an error checking the review
 */
export const hasReviewedProduct = async (userId, productId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/reviews/product/${productId}`);
        const reviews = response.data;
        // Verify if the response is an array
        if (!Array.isArray(reviews)) {
            console.error('Expected an array of reviews, but received:', reviews);
            return false;
        }
        // Verify if the user has already reviewed the product
        const result = reviews.some(review => review.userId._id.toString() === userId);
        return result;
    } catch (error) {
        console.error('Error checking product review:', error);
        throw error;
    }
}
