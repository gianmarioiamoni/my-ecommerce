import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


export const getCategories = async () => {
    initAuthorizationHeader();
    const response = await axios.get(`${serverURL}/categories`);
    return response.data;
};

export const addCategory = async (category) => {
    initAuthorizationHeader();
    const response = await axios.post(`${serverURL}/categories`, { name: category });
    return response.data;
};

export const deleteCategory = async (category) => {
    initAuthorizationHeader();
    await axios.delete(`${serverURL}/categories/${category}`);
};

export const updateCategory = async (oldCategory, newCategory) => {
    initAuthorizationHeader();
    const response = await axios.put(`${serverURL}/categories/${oldCategory}`, { name: newCategory });
    return response.data;
};
