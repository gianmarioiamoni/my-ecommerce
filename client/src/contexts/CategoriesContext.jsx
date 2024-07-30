import React, { createContext, useState, useEffect, useContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // load categories from local storage on component mount
        const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
        setCategories(savedCategories);
    }, []);

    useEffect(() => {
        // save categories to local storage when they change
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const value = {
        categories,
        setCategories,
    };

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => useContext(CategoriesContext);

