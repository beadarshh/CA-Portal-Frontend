import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppConfig from '../config';
import '../App.css';

const Sidebar = ({ selectedSidebarOption, selected, setSelected, role }) => {
    const navigate = useNavigate();

    const handleClick = (option) => {
        setSelected(option);
        navigate(`/dashboard/${option}`, { state: { role } });
    };

    return (
        <div className="sidebar">
            <h3>{'\u{1F310}'} {AppConfig.sidebarItems.dashboard}</h3>
            <ul>
                {selectedSidebarOption === 'downloadcertificate' && (
                    <>
                        <li>
                            <button
                                className={`sidebar-btn ${selected === 'downloadcertificatesbundle' ? 'selected' : ''}`}
                                onClick={() => handleClick('downloadcertificatesbundle')}
                            >
                                {AppConfig.sidebarItems.certificatebundle}
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-btn ${selected === 'downloadissuedcertificate' ? 'selected' : ''}`}
                                onClick={() => handleClick('downloadissuedcertificate')}
                            >
                                {AppConfig.sidebarItems.issuedCertificate}
                            </button>
                        </li>
                    </>
                )}
                {selectedSidebarOption === 'revokecertificates' && role === 'admin' && (
                    <li>
                        <button
                            className={`sidebar-btn ${selected === 'revokecertificate' ? 'selected' : ''}`}
                            onClick={() => handleClick('revokecertificate')}
                        >
                            {AppConfig.sidebarItems.revoke}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
