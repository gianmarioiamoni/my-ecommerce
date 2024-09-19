import axios from 'axios';

import serverURL from '../config/serverURL';

import { initAuthorizationHeader } from '../config/initAuthorizationHeader';


/**
 * Get all categories from the server.
 * @return {Promise<Array<Object>>} A promise resolving to an array of category objects.
 */
export const getCategories = async () => {
    initAuthorizationHeader();
    const response = await axios.get(`${serverURL}/categories`);
    return response.data;
};

/**
 * Add a new category to the server.
 * @param {string} category - The name of the category to add.
 * @return {Promise<Object>} A promise resolving to the newly added category.
 */
export const addCategory = async (category) => {
    initAuthorizationHeader();
    const response = await axios.post(`${serverURL}/categories`, { name: category });
    return response.data;
};

/**
 * Delete a category from the server.
 *
 * @param {string} category - The name of the category to delete.
 *
 * @return {Promise<void>} A promise resolving when the category has been deleted.
 */
export const deleteCategory = async (category) => {
    initAuthorizationHeader();
    await axios.delete(`${serverURL}/categories/${category}`);
};

/**
 * Update a category in the server.
 *
 * @param {string} oldCategory - The old name of the category to update.
 * @param {string} newCategory - The new name of the category to update.
 *
 * @return {Promise<Object>} A promise resolving to the updated category.
 */
export const updateCategory = async (oldCategory, newCategory) => {
    initAuthorizationHeader();
    const response = await axios.put(`${serverURL}/categories/${oldCategory}`, { name: newCategory });
    return response.data;
};
