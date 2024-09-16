import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, updateUser, removeUser } from '../services/usersServices';

import i18n from 'i18next';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         try {
    //             const decoded = jwtDecode(token);
    //             setUser({
    //                 email: decoded.email,
    //                 id: decoded.id,
    //                 isAdmin: decoded.isAdmin,
    //                 name: decoded.name,
    //                 photoUrl: decoded.photoUrl,
    //                 addresses: decoded.addresses || [],
    //                 paymentMethods: decoded.paymentMethods || [],
    //                 language: decoded.language || 'en'  // Assicura il default
    //             });
    //         } catch (error) {
    //             console.error("Error decoding token:", error);
    //             localStorage.removeItem('token');
    //         }
    //     }
    //     setLoading(false);
    // }, []);

    // useEffect(() => {
    //     if (user) {
    //         // Set the user language in the i18n instance
    //         i18n.changeLanguage(user.language);
    //     }
    // }, [user, i18n]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                const userLanguage = decoded.language || 'en'; // recupera la lingua dal token o imposta di default 'en'

                // Imposta la lingua nel contesto AuthContext
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

                // Cambia la lingua in i18n
                i18n.changeLanguage(userLanguage);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);


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

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

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





