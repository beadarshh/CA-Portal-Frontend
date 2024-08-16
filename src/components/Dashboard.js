/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Blocks from './Blocks';
import Table from './Table';
import Footer from './Footer';
import FilterOptions from './FilterOptions';
import AppConfig from '../config';
import DownloadCertificate from './DownloadCertificate';
import DownloadCertificatesBundle from './DownloadCertificatesBundle';
import DownloadIssuedCertificate from './DownloadIssuedCertificate';
import RevokeCertificates from './RevokeCertificates';
import '../App.css';

const Dashboard = ({ role }) => {
    const [selected, setSelected] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSidebarOption, setSelectedSidebarOption] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        setSelected(path);
    }, [location.pathname]);

    const handleHomeClick = () => {
        navigate('/dashboard', { state: { role } });
        setSelected(''); // Clear selection on home click
    };

    const handleShowCertificates = () => {
        setShowFilterOptions(true);
        setShowTable(false); // Hide the table when showing filter options
    };

    return (
        <div className="App">
            <Navbar role={role} handleHomeClick={handleHomeClick} />
            <div className="container">
                <Sidebar 
                    selectedSidebarOption={selectedSidebarOption}
                    selected={selected} 
                    setSelected={setSelected} 
                    role={role} 
                />
                <div className="content">
                    <Blocks 
                        selected={selected} 
                        setSelected={setSelected} 
                        setSelectedSidebarOption={setSelectedSidebarOption} 
                        role={role}
                    />
                    {/* Conditionally render the outer-box and Routes only if an option is selected */}
                    {selected && (
                        <div className="outer-box">
                            <Routes>
                                <Route path="downloadcertificate" element={<DownloadCertificate />} /> 
                                {selected === 'downloadcertificatesbundle' && (
                                    <Route path="downloadcertificatesbundle" element={<DownloadCertificatesBundle />} />
                                )}
                                {selected === 'downloadissuedcertificate' && (
                                    <Route path="downloadissuedcertificate" element={<DownloadIssuedCertificate />} />
                                )}
                                {selected === 'revokecertificate' && (
                                    <Route path="revokecertificate" element={<RevokeCertificates />} />
                                )}
                            </Routes>

                            {showFilterOptions && (
                                <FilterOptions setFilteredData={setFilteredData} setShowTable={setShowTable} setLoading={setLoading} />
                            )}
                            {showTable && (
                                <div className="table-container">
                                    <Table
                                        data={filteredData} // Use the filtered data
                                        onSearch={() => {}} // Implement search function if needed
                                        setData={setFilteredData} // Update filtered data
                                        setFilteredData={setFilteredData} // Update filtered data
                                        role={role}
                                        filteredData={filteredData} // Use the filtered data
                                        selectedOption={selected} // Pass the selected option
                                        loading={loading} // Pass loading state to Table
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer handleHomeClick={handleHomeClick} />
        </div>
    );
};

export default Dashboard;
