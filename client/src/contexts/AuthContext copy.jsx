import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, updateUser, removeUser } from '../services/usersServices';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                email: decoded.email,
                id: decoded.id,
                isAdmin: decoded.isAdmin,
                name: decoded.name || decoded.email // Usa il campo `name` se disponibile, altrimenti usa l'email
            });
        }
    }, []);

    const login = async (formData) => {
        const { token } = await loginUser(formData);
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            email: decoded.email,
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            name: decoded.name || decoded.email // Usa il campo `name` se disponibile, altrimenti usa l'email
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const update = async (updateData) => {
        console.log("update() - updateData: ", updateData);
        console.log("update() - user: ", user);
        try {
            const updatedUser = await updateUser(user.id, updateData);
            console.log("update() - updatedUser: ", updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async () => {
        // await axios.delete('/auth/me');
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


