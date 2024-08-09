import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, updateUser, removeUser } from '../services/usersServices';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.email,
                    id: decoded.id,
                    isAdmin: decoded.isAdmin,
                    name: decoded.name || decoded.email,
                });
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token'); // Rimuovi il token non valido
            }
        }
    }, []);

    const login = async (formData) => {
        const { token } = await loginUser(formData);
        console.log("Received Token: ", token);
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            email: decoded.email,
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            name: decoded.name || decoded.email,
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
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);

                setUser(prevUser => ({
                    ...prevUser,
                    ...response // sovrascrivi le proprietà aggiornate
                }));
                // setUser({
                //     email: decoded.email,
                //     id: decoded.id,
                //     isAdmin: decoded.isAdmin,
                //     name: decoded.name || decoded.email,
                // });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const remove = async () => {
        await removeUser(user.id);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, update, remove }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };




