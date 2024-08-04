// PrivateRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Se l'utente non è autenticato, reindirizza a /login
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.isAdmin ? 'admin' : 'user')) {
    // Se l'utente non ha il ruolo richiesto, reindirizza a /products
    return <Navigate to="/products" />;
  }

  return <Route {...rest} element={<Component />} />;
};

export default PrivateRoute;
