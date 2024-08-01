import axios from 'axios';

import serverURL from '../config/serverURL';


export const getCategories = async () => {
    const response = await axios.get(`${serverURL}/categories`);
    return response.data;
};

export const addCategory = async (category) => {
    const response = await axios.post(`${serverURL}/categories`, { name: category });
    return response.data;
};

export const deleteCategory = async (category) => {
    await axios.delete(`${serverURL}/categories/${category}`);
};

export const updateCategory = async (oldCategory, newCategory) => {
    const response = await axios.put(`${serverURL}/categories/${oldCategory}`, { name: newCategory });
    return response.data;
};
