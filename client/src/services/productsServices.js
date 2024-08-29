import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${serverURL}/products`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const updateProduct = async (id, product) => {
    try {
        initAuthorizationHeader();
        const response = await axios.patch(`${serverURL}/products/${id}`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const deleteProduct = async (id) => {
    try {
        initAuthorizationHeader();
        const response = await axios.delete(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const createProduct = async (product) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`${serverURL}/products`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const uploadImage = async (formData) => {
    try {
        initAuthorizationHeader();
        const response = await axios.post(`/api/upload`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const updateProductQuantity = async (id, quantityChange) => {
    try {
        initAuthorizationHeader();
        const response = await axios.patch(`${serverURL}/products/updateQuantity/${id}`, { quantityChange });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};



