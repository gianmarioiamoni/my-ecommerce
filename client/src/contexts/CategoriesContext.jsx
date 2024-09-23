import React, { createContext, useState, useContext } from 'react';
import { useQuery } from 'react-query';

import { getCategories, addCategory, deleteCategory, updateCategory } from '../services/categoriesServices';

const CategoriesContext = createContext();

/**
 * Custom hook to fetch categories using React Query.
 */
const useFetchCategories = () => {
    return useQuery('categories', async () => {
        const fetchedCategories = await getCategories();
        // Maps the categories to their names
        return fetchedCategories.map(cat => cat.name);
    }, {
        staleTime: 1000 * 60 * 5, // cache the categories for 5 minutes
        onError: (error) => {
            console.error("Error fetching categories:", error);
        }
    });
};

/**
 * This component provides the categories context to its children.
 * It fetches the categories from the server using React Query.
 * It also provides functions to add, delete and update categories.
 *
 * @param {ReactNode} children The children of the component.
 * @returns {ReactElement} The CategoriesProvider component.
 */
export const CategoriesProvider = ({ children }) => {
    // Fetch the categories using the custom useQuery hook
    const { data: categories, refetch } = useFetchCategories();
    const [localCategories, setLocalCategories] = useState([]);

    /**
     * Sync state when categories are fetched
     */
    React.useEffect(() => {
        if (categories) {
            setLocalCategories(categories);
        }
    }, [categories]);

    /**
     * Adds a new category to the state and refetches categories.
     * @param {string} category The name of the new category.
     */
    const handleAddCategory = async (category) => {
        const newCategory = await addCategory(category);
        // Refetch the categories after adding a new one
        refetch();
    };

    /**
     * Deletes a category from the state and refetches categories.
     * @param {string} category The name of the category to delete.
     */
    const handleDeleteCategory = async (category) => {
        await deleteCategory(category);
        // Refetch the categories after deleting one
        refetch();
    };

    /**
     * Updates a category in the state and refetches categories.
     * @param {string} oldCategory The name of the category to update.
     * @param {string} newCategory The new name of the category.
     */
    const handleUpdateCategory = async (oldCategory, newCategory) => {
        await updateCategory(oldCategory, newCategory);
        // Refetch the categories after updating one
        refetch();
    };

    /**
     * The value of the context, which is an object with the categories 
     * and the functions to add, delete and update categories.
     */
    const value = {
        categories: localCategories,
        addCategory: handleAddCategory,
        deleteCategory: handleDeleteCategory,
        updateCategory: handleUpdateCategory,
    };

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => useContext(CategoriesContext);



