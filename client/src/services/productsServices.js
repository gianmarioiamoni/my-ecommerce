import axios from 'axios';

import serverURL from '../config/serverURL';


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
        const response = await axios.patch(`${serverURL}/products/${id}`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
};

export const createProduct = async (product) => {
    try {
        const response = await axios.post(`${serverURL}/products`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const uploadImage = async (formData) => {
    try {
        const response = await axios.post(`${serverURL}/upload`, formData);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}



