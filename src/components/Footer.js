/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import AppConfig from '../config';
import logo from '../assets/logo.png';
import './componentscss/Footer.css';

const Footer = ({handleHomeClick}) => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    

    return (
        <footer>
            <div className="top">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <button className='home-btn' onClick={handleHomeClick}> Home </button>
                {/* <a href="#">Blog</a>
                <a href="#">Contact</a>
                <a href="#">Feedback</a> */}
            </div>
            <div className="separator"></div>
            <div className="bottom">
                <div className="links">
                    {/* <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookies Setting</a> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
