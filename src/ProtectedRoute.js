import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Get authentication state from the context

    if (!isAuthenticated) {
        return <Navigate to="/" />; // If not authenticated, navigate to the login page
    }

    return children; // If authenticated, render the children components
};

export default ProtectedRoute;
