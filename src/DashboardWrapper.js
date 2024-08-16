// DashboardWrapper.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';

const DashboardWrapper = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = location.state?.role || sessionStorage.getItem('role') || 'user';

    useEffect(() => {
        if (!location.state?.role) {
            navigate(location.pathname, { replace: true, state: { role } });
        }
    }, [location.pathname, location.state, navigate, role]);

    return (
        <Routes>
            <Route path="*" element={<Dashboard role={role} />} />
        </Routes>
    );
};

export default DashboardWrapper;
