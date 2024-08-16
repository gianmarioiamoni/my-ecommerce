import axios from "axios";

import serverURL from "../config/serverURL";


export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        return { error: error.response.data.error };
    }
}


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${serverURL}/users/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${serverURL}/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}



export const removeUser = async (userId) => {
    try {
        const response = await axios.delete(`${serverURL}/users/${userId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const uploadProfilePicture = async (formData) => {
    try {
        const response = await axios.post(`/api/uploadProfilePicture`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const sendPasswordResetEmail = async (email) => {
    try {
        const response = await axios.post(`/api/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    try {
        // const response = await axios.post(`${serverURL}/users/reset-password`, { token, password });
        const response = await axios.post(`/api/reset-password`, { token, password });
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};

// ADDRESSES AND PAYMENT METHODS SERVICES

export const getAddresses = async (userId) => {
    try {
        const response = await axios.get(`${serverURL}/users/${userId}/addresses`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const addAddress = async (userId, newAddress) => {
    try {
        const response = await axios.post(`${serverURL}/users/${userId}/addresses`, newAddress);
        return response.data;
    } catch (error) {
       return { error: error.response.data.error }; 
    }
};

export const deleteAddress = async (userId, addressId) => {
    try {
        const response = await axios.delete(`${serverURL}/users/${userId}/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};


export const getPaymentMethods = async (userId) => {
    try {
        const response = await axios.get(`${serverURL}/users/${userId}/payment-methods`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const addPaymentMethod = async (userId, newPayment) => {
    try {
        const response = await axios.post(`${serverURL}/users/${userId}/payment-methods`, newPayment);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const deletePaymentMethod = async (userId, paymentMethodId) => {
    try {
        const response = await axios.delete(`${serverURL}/users/${userId}/payment-methods/${paymentMethodId}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

