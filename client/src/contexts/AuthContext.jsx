import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser, updateUser, removeUser } from '../services/usersServices';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.email,
                    id: decoded.id,
                    isAdmin: decoded.isAdmin,
                    name: decoded.name,
                    photoUrl: decoded.photoUrl
                });
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token'); // Rimuovi il token non valido
            }
        }
        setLoading(false);  // Indica che il caricamento è terminato
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
            name: decoded.name,
            photoUrl: decoded.photoUrl
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
                    // Aggiorna il token nel localStorage
                    localStorage.setItem('token', token);

                    // Aggiorna l'utente nel contesto
                    setUser(prevUser => ({
                        ...prevUser,
                        ...response // sovrascrivi le proprietà aggiornate
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
        return <div>Loading...</div>;  // Mostra un indicatore di caricamento mentre il token viene elaborato
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, update, remove, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };




