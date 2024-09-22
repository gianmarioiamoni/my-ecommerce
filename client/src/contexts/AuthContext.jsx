import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, updateUser, removeUser } from '../services/usersServices';

import i18n from 'i18next';


const AuthContext = createContext();

/**
 * Provides an authentication context to the application.
 * The context contains the currently logged in user, and functions to login, logout, update the user, and remove the user.
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the user from the local storage and sets it in the context
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                /**
                 * Decodes the token to get the user data
                 */
                const decoded = jwtDecode(token);
                const userLanguage = decoded.language || 'en'; // retrieve the user's language from the token 

                // setup the language in the context
                setUser({
                    email: decoded.email,
                    id: decoded.id,
                    isAdmin: decoded.isAdmin,
                    name: decoded.name,
                    photoUrl: decoded.photoUrl,
                    addresses: decoded.addresses || [],
                    paymentMethods: decoded.paymentMethods || [],
                    language: userLanguage
                });

                // change the language in i18n
                i18n.changeLanguage(userLanguage);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);


    /**
     * Updates the user's language in the context and in the local storage
     * @param {string} newLanguage - the new language
     */
    const updateUserLanguage = async (newLanguage) => {
        if (user) {
            const updatedUser = { ...user, language: newLanguage };
            const response = await updateUser(user.id, { language: newLanguage });

            if (!response.error) {
                setUser(updatedUser);
            } else {
                console.error(response.error);
            }
        }
    };


    /**
     * Logs in the user and updates the context
     * @param {Object} formData - the form data
     */
    const login = async (formData) => {
        const { token } = await loginUser(formData);
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            email: decoded.email,
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            name: decoded.name,
            photoUrl: decoded.photoUrl,
            addresses: decoded.addresses || [],
            paymentMethods: decoded.paymentMethods || [],
            language: decoded.language || 'en'
        });
    };

    /**
     * Logs out the user and removes the token from the local storage
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    /**
     * Updates the user's data in the context and in the local storage
     * @param {Object} updateData - the data to update
     * @param {string} currentPassword - the current password
     */
    const update = async (updateData, currentPassword) => {
        try {
            const response = await updateUser(user.id, { ...updateData, currentPassword });
            if (response && !response.error) {
                const { token } = response;

                if (token) {
                    // Update the token in the local storage
                    localStorage.setItem('token', token);

                    // Decode the token to get the user data
                    const decoded = jwtDecode(token);

                    // Update the user in the context with the new data
                    setUser(prevUser => ({
                        ...prevUser,
                        ...decoded // override prevUser with decoded
                    }));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Removes the user from the local storage
     */
    const remove = async () => {
        await removeUser(user.id);
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;  // Show a loading indicator while the data is being fetched 
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, update, remove, loading, updateUserLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };





