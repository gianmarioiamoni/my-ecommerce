import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCategories, addCategory, deleteCategory, updateCategory } from '../services/categoriesServices';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories.map(cat => cat.name));
        };
        fetchCategories();
    }, []);

    const handleAddCategory = async (category) => {
        const newCategory = await addCategory(category);
        setCategories([...categories, newCategory.name]);
    };

    const handleDeleteCategory = async (category) => {
        await deleteCategory(category);
        setCategories(categories.filter(cat => cat !== category));
    };

    const handleUpdateCategory = async (oldCategory, newCategory) => {
        const updatedCategory = await updateCategory(oldCategory, newCategory);
        setCategories(categories.map(cat => (cat === oldCategory ? updatedCategory.name : cat)));
    };

    const value = {
        categories,
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


