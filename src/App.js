import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import RoleSelection from './RoleSelection';
import DashboardWrapper from './DashboardWrapper';
import Logoutpage from './components/Logoutpage'; 
import './App.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<RoleSelection />} />
                    <Route path="/dashboard/*" element={<DashboardWrapper />} />
                    <Route path="/logoutpage" element={<Logoutpage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
