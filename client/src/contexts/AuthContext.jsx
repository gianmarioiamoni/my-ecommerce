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
                    photoUrl: decoded.photoUrl,
                    addresses: decoded.addresses || [],  // Assicurati che ci siano sempre valori predefiniti
                    paymentMethods: decoded.paymentMethods || []  // Anche qui valori predefiniti
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
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            email: decoded.email,
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            name: decoded.name,
            photoUrl: decoded.photoUrl,
            addresses: decoded.addresses || [],
            paymentMethods: decoded.paymentMethods || []
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

                    // Decodifica il nuovo token per ottenere i dati aggiornati
                    const decoded = jwtDecode(token);

                    // Aggiorna l'utente nel contesto con i nuovi dati, comprese addresses e paymentMethods
                    setUser(prevUser => ({
                        ...prevUser,
                        ...decoded // sovrascrivi le proprietà aggiornate
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





