import axios from 'axios';

import serverURL from '../config/serverURL';

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${serverURL}/products/${id}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${serverURL}/products`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

export const createProduct = async (product) => {
    try {
        const response = await axios.post(`${serverURL}/products`, product);
        return response.data;
    } catch (error) {
        return { error: error.response.data.error };
    }
}

