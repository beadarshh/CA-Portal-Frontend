/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import AppConfig from '../config';
import logo from '../assets/logo.png';
import '../App.css';
import Cookies from 'js-cookie';

const Navbar = ({ role, handleHomeClick }) => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = () => {
        Cookies.remove('authToken');
        sessionStorage.removeItem('role');
        localStorage.removeItem('reactsessionId');
        localStorage.removeItem('sessionId');
        setIsAuthenticated(false);
        navigate('/logoutpage');
    };

    return (
        <nav>
            <div className="logo">
                <img src={logo} alt="Logo" />
                <a href="#" onClick={handleHomeClick}>{AppConfig.appName}</a>
            </div>
            <ul>
                <li>
                    <button className='home-btn' onClick={handleHomeClick}> Home </button>
                </li>
                {role === 'admin' && (
                    <div className='Admin'>
                        <li><a href="#name">Admin</a></li>
                        <li><a href="#email">admin@cdot.in</a></li>
                    </div>
                )}
                {role === 'user' && (
                    <div className='User'>
                        <li><a href="#name">User</a></li>
                        <li><a href="#email">user@cdot.in</a></li>
                    </div>
                )}
                <li><button className="logout-btn" onClick={handleLogout}>{AppConfig.navItems.logout}</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
