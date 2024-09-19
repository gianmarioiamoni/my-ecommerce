import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


/**
 * Fetches all products from the server
 * @return {Array} The array of products
 * @throws {Error} If there is an error fetching the products
 */
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${serverURL}/products`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Fetches a product by its id
 * @param {string} id - The id of the product to fetch
 * @return {Object} The product
 * @throws {Error} If there is an error fetching the product
 */
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Updates a product in the database
 * @param {string} id - The id of the product to update
 * @param {Object} product - The product data to update
 * @return {Object} The updated product
 * @throws {Error} If there is an error updating the product
 */
export const updateProduct = async (id, product) => {
    try {
        initAuthorizationHeader();
        const response = await axios.patch(`${serverURL}/products/${id}`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Deletes a product from the database
 * @param {string} id - The id of the product to delete
 * @return {Object} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error deleting the product
 */
export const deleteProduct = async (id) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Creates a new product in the database
 * @param {Object} product - The product data to create
 * @return {Object} The created product
 * @throws {Error} If there is an error creating the product
 */
export const createProduct = async (product) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/products`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Uploads an image to the server
 * @param {Object} formData - The form data object containing the image to upload
 * @return {Object} The response from the server. If the request is successful, the response will contain the image URL. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error uploading the image
 */
export const uploadImage = async (formData) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/api/upload`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Updates the quantity of a product in the database
 * @param {string} id - The ID of the product to update
 * @param {number} quantityChange - The amount to change the product quantity by
 * @return {Object} The response from the server. If the request is successful, the response will contain the updated product. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error updating the product quantity
 */
export const updateProductQuantity = async (id, quantityChange) => {
    try {
        initAuthorizationHeader();
        const response = await axios.patch(`${serverURL}/products/updateQuantity/${id}`, { quantityChange });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

/**
 * Checks if an order is delivered
 * @param {string} userId - The ID of the user who made the order
 * @param {string} productId - The ID of the product in the order
 * @return {boolean} True if the order is delivered, false otherwise
 * @throws {Error} If there is an error checking if the order is delivered
 */
export const isOrderDelivered = async (userId, productId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/orders/delivered/${userId}/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}



