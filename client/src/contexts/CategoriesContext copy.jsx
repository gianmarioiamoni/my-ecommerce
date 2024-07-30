import React, { createContext, useState, useContext } from 'react';

// Creiamo il contesto
const CategoriesContext = createContext();

// Creiamo il provider del contesto
export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(["Electronics", "Books", "Clothing", "Home", "Beauty"]);

    return (
        <CategoriesContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
};

// Hook per usare il contesto
export const useCategories = () => {
    return useContext(CategoriesContext);
};
