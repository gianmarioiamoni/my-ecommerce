import axios from "axios";

import serverURL from "../config/serverURL";

import { initAuthorizationHeader } from "../config/initAuthorizationHeader";


/**
 * Logs in a user
 * @param {Object} userData The user data to be sent to the server
 * @property {string} email The email of the user
 * @property {string} password The password of the user
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the access token. If the request fails, the response will contain an error message.
 */
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        return { error: error.response.data.error };
    }
}


/**
 * Registers a new user
 * @param {Object} userData The user data to be sent to the server
 * @property {string} firstName The first name of the user
 * @property {string} lastName The last name of the user
 * @property {string} email The email of the user
 * @property {string} password The password of the user
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the access token. If the request fails, the response will contain an error message.
 */
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Updates a user
 * @param {string} userId The ID of the user to be updated
 * @param {Object} userData The user data to be sent to the server
 * @property {string} firstName The new first name of the user
 * @property {string} lastName The new last name of the user
 * @property {string} email The new email of the user
 * @property {string} password The new password of the user
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the updated user data. If the request fails, the response will contain an error message.
 */
export const updateUser = async (userId, userData) => {
    try {
        initAuthorizationHeader();
        const response = await axios.put(`${serverURL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}


/**
 * Removes a user
 * @param {string} userId The ID of the user to be removed
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 */
export const removeUser = async (userId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/users/${userId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Uploads a new profile picture for the current user
 * @param {Object} formData - The form data containing the image to upload
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the new profile picture URL. If the request fails, the response will contain an error message.
 */
export const uploadProfilePicture = async (formData) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/api/uploadProfilePicture`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

/**
 * Sends a password reset email to the given email address
 * @param {string} email - The email address to send the password reset email to
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 */
export const sendPasswordResetEmail = async (email) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/api/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};

/**
 * Fetches all users from the server
 * @return {Promise<Array>} The array of users
 * @throws {Error} If there is an error fetching the users
 */
export const getAllUsers = async () => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Resets the password for the user with the given token and password
 * @param {string} token - The token for resetting the password
 * @param {string} password - The new password for the user
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error resetting the password
 */
export const resetPassword = async (token, password) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/api/reset-password`, { token, password });
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};

// fetch the user language from the backend
export const fetchUserLanguage = async (userId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/users/${userId}`);
        return response.data.language;
    } catch (error) {
        console.error("Error fetching user language:", error);
        throw error;
    }
}



// ADDRESSES AND PAYMENT METHODS SERVICES

/**
 * Fetches all addresses for the given user
 * @param {string} userId - The ID of the user to fetch the addresses for
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain an array of addresses. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error fetching the addresses
 */
export const getAddresses = async (userId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/users/${userId}/addresses`);
        return response.data;
    } catch (error) {
        return { error: error.response ? error.response.data.error : error.message };
    }
};

/**
 * Adds a new address to the given user
 * @param {string} userId - The ID of the user to add the address to
 * @param {Object} newAddress - The new address to add
 * @property {string} newAddress.fullName - The full name to use for the address
 * @property {string} newAddress.address - The address to use for the address
 * @property {string} newAddress.city - The city to use for the address
 * @property {string} newAddress.postalCode - The postal code to use for the address
 * @property {string} newAddress.country - The country to use for the address
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the new address. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error adding the address
 */
export const addAddress = async (userId, newAddress) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/users/${userId}/addresses`, newAddress);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Deletes an address from the given user
 * @param {string} userId - The ID of the user to delete the address from
 * @param {string} addressId - The ID of the address to delete
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error deleting the address
 */
export const deleteAddress = async (userId, addressId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/users/${userId}/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


/**
 * Fetches all payment methods for the given user
 * @param {string} userId - The ID of the user to fetch the payment methods for
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain an array of payment methods. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error fetching the payment methods
 */
export const getPaymentMethods = async (userId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.get(`${serverURL}/users/${userId}/payment-methods`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Adds a new payment method to the given user
 * @param {string} userId - The ID of the user to add the payment method to
 * @param {Object} newPayment - The new payment method to add
 * @property {string} newPayment.cardNumber - The card number of the payment method
 * @property {string} newPayment.cardholderName - The cardholder name of the payment method
 * @property {string} newPayment.expirationDate - The expiration date of the payment method
 * @property {string} newPayment.securityCode - The security code of the payment method
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain the new payment method. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error adding the payment method
 */
export const addPaymentMethod = async (userId, newPayment) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/users/${userId}/payment-methods`, newPayment);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

/**
 * Deletes a payment method from the given user
 * @param {string} userId - The ID of the user to delete the payment method from
 * @param {string} paymentMethodId - The ID of the payment method to delete
 * @return {Promise<Object>} The response from the server. If the request is successful, the response will contain a success message. If the request fails, the response will contain an error message.
 * @throws {Error} If there is an error deleting the payment method
 */
export const deletePaymentMethod = async (userId, paymentMethodId) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/users/${userId}/payment-methods/${paymentMethodId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

