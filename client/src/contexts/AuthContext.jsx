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
                    addresses: decoded.addresses || [],  // assure that the default value is an empty array
                    paymentMethods: decoded.paymentMethods || []  
                });
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token'); // remove the invalid token
            }
        }
        setLoading(false);  // the component is ready
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
        <AuthContext.Provider value={{ user, login, logout, update, remove, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };





