// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * PrivateRoute component.
 * This component is used to protect routes that require authentication.
 * If the user is not authenticated, it redirects to the login page.
 * If the user is authenticated, it renders the component that is passed as a prop.
 * If the user has the right role, it renders the component that is passed as a prop.
 * If the user does not have the right role, it redirects to the products page.
 * @param {{ element: ReactNode, roles: string[] }} props
 * @returns {ReactNode}
 */
const PrivateRoute = ({ element, roles }) => {
    const { user, loading } = useContext(AuthContext);

    // If the user is not authenticated, redirect to login
    if (!user) {
        if (loading) {
            return <div>Loading...</div>; // show loading message
        }
        return <Navigate to="/login" replace />; // redirect to login page
    }

    // If the user does not have the right role, redirect to products
    if (roles && !roles.includes(user.isAdmin ? 'admin' : 'user')) {
        return <Navigate to="/products" replace />;
    }

    // Render the component that is passed as a prop
    return element;
};

export default PrivateRoute;

