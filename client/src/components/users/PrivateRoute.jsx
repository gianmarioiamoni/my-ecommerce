// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ element, roles }) => {
    const { user, loading } = useContext(AuthContext);

    if (!user) {
        // if the user is not authenticated, redirect to login 
        if (loading) {
            return <div>Loading...</div>;
        }
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.isAdmin ? 'admin' : 'user')) {
        // if has not the right role, redirect to products
        return <Navigate to="/products" replace />;
    }

    return element;
};

export default PrivateRoute;

