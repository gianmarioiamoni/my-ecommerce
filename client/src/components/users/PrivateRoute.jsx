// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ element, roles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Se l'utente non è autenticato, reindirizza a /login
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.isAdmin ? 'admin' : 'user')) {
        // Se l'utente non ha il ruolo richiesto, reindirizza a /products
        return <Navigate to="/products" replace />;
    }

    return element;
};

export default PrivateRoute;

