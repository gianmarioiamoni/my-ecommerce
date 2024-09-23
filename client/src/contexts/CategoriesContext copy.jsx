import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';

import { getCategories, addCategory, deleteCategory, updateCategory } from '../services/categoriesServices';

const CategoriesContext = createContext();



/**
 * This component provides the categories context to its children.
 * It fetches the categories from the server on mount and stores them in the state.
 * It also provides functions to add, delete and update categories.
 *
 * @param {ReactNode} children The children of the component.
 * @returns {ReactElement} The CategoriesProvider component.
 */
export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    /**
     * Fetches the categories from the server on mount.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            /**
             * Fetches the categories from the server.
             * Maps the categories to their names and sets them as the state.
             */
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories.map(cat => cat.name));
        };
        fetchCategories();
    }, []);
    

    /**
     * Adds a new category to the state.
     * @param {string} category The name of the new category.
     */
    const handleAddCategory = async (category) => {
        /**
         * Adds the new category to the server.
         * Updates the state with the new category.
         */
        const newCategory = await addCategory(category);
        setCategories([...categories, newCategory.name]);
    };

    /**
     * Deletes a category from the state.
     * @param {string} category The name of the category to delete.
     */
    const handleDeleteCategory = async (category) => {
        /**
         * Deletes the category from the server.
         * Updates the state by removing the category.
         */
        await deleteCategory(category);
        setCategories(categories.filter(cat => cat !== category));
    };

    /**
     * Updates a category in the state.
     * @param {string} oldCategory The name of the category to update.
     * @param {string} newCategory The new name of the category.
     */
    const handleUpdateCategory = async (oldCategory, newCategory) => {
        /**
         * Updates the category in the server.
         * Updates the state with the new category name.
         */
        const updatedCategory = await updateCategory(oldCategory, newCategory);
        setCategories(categories.map(cat => (cat === oldCategory ? updatedCategory.name : cat)));
    };

    /**
     * The value of the context, which is an object with the categories and the functions to add, delete and update categories.
     */
    const value = {
        categories,
        addCategory: handleAddCategory,
        deleteCategory: handleDeleteCategory,
        updateCategory: handleUpdateCategory,
    };

    return (
        /**
         * The CategoriesProvider component.
         * It wraps the children with the CategoriesContext.Provider.
         */
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => useContext(CategoriesContext);


