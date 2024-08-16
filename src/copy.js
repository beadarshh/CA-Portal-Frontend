/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import RoleSelection from './RoleSelection';
import AppConfig from './config';
import './App.css';
import logo from './assets/logo.png';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthProvider, useAuth } from './AuthProvider';
//import ProtectedRoute from './ProtectedRoute';

Modal.setAppElement('#root'); // Important for accessibility


const Navbar = ({ role, handleHomeClick }) => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth(); // Get the auth context method

    const handleLogout = () => {
        sessionStorage.removeItem('authToken'); // or localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav>
            <div className="logo">
                <img src={logo} alt="Logo" />
                <a href="#" onClick={handleHomeClick} >{AppConfig.appName}</a>
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

const Sidebar = ({ selected, setSelected, role, setRole }) => {
    const handleClick = (option) => {
        setSelected(option);
    };
    console.log('Role:', role);
    console.log('Selected Option:', selected);

    return (
        <div className="sidebar">
            <h3>{'\u{1F310}'}{AppConfig.sidebarItems.dashboard}</h3>
            <ul>
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
                        className={`sidebar-btn ${selected === 'downloadcertificates' ? 'selected' : ''}`}
                        onClick={() => handleClick('downloadcertificates')}
                    >
                        {AppConfig.sidebarItems.certificate}
                    </button>
                </li>
                
                {role === 'admin' && (
                    <li>
                        <button
                            className={`sidebar-btn ${selected === 'revokecertificates' ? 'selected' : ''}`}
                            onClick={() => handleClick('revokecertificates')}
                        >
                            {AppConfig.sidebarItems.revoke}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};



const Blocks = ({ selected, selectedSubscriber, setSelectedSubscriber, selectedSubscription, setSelectedSubscription }) => {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/subscriptions')
            .then(response => {
                setSubscriptions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the subscriptions data!', error);
            });
    }, []);

    const handleSubscriberChange = (e) => {
        setSelectedSubscriber(e.target.value);
    };

    const handleSubscriptionChange = (e) => {
        setSelectedSubscription(e.target.value);
    };

    // Get unique subscribers
    const uniqueSubscribers = [...new Set(subscriptions.map(sub => sub.subscriber))];

    // Get unique SSBs filtered by selected subscriber
    const filteredSSB = subscriptions
        .filter(sub => sub.subscriber === selectedSubscriber)
        .map(sub => sub.ssb);
    const uniqueSSB = [...new Set(filteredSSB)];

    return (
        <div className="blocks">
            {(selected === 'downloadcertificates' || selected === 'revokecertificates') && (
                <>
                    <div className="block">
                        <h3>{'\u{1F465}'} {AppConfig.blocks.selectsubscriber.heading}</h3>
                        <select value={selectedSubscriber} onChange={handleSubscriberChange}>
                            <option value="">Select Subscriber</option>
                            {uniqueSubscribers.map((subscriber, index) => (
                                <option key={index} value={subscriber}>{subscriber}</option>
                            ))}
                        </select>
                    </div>
                    {selectedSubscriber && (
                        <div className="block">
                            <h3>{'\u{1F4CB}'} {AppConfig.blocks.selectservice.heading}</h3>
                            <select value={selectedSubscription} onChange={handleSubscriptionChange}>
                                <option value="">Select SSB</option>
                                {uniqueSSB.map((ssb, index) => (
                                    <option key={index} value={ssb}>{ssb}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};



const Table = ({ data, onSearch, setData, setFilteredData, role, filteredData, selectedOption }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCertificateSan, setSelectedCertificateSan] = useState(null);
    const [reason, setReason] = useState('');
    const [isSelectError, setIsSelectError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isRevocationSuccessful, setIsRevocationSuccessful] = useState(false);
    const reasons = [
        'Unspecified',
        'Key compromise',
        'CA compromise',
        'Affiliation changed',
        'Superseded',
        'Cessation of operation',
        'Certificate hold'
    ];

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Formats the date as yyyy-mm-dd
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

    const handleRevoke = (san) => {
        setSelectedCertificateSan(san);  
        setModalIsOpen(true);
        setSuccessMessage('');
        setIsRevocationSuccessful(false);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedCertificateSan(null);
        setReason('');
        setIsSelectError(false);
    };

    const submitRevoke = () => {
        if (!selectedCertificateSan) {
            console.log('No certificate selected for revocation');
            return;
        }
        if (!reason) {
            setIsSelectError(true);
            setErrorMessage('Select a reason');
            console.log('No reason provided for revocation');
            return;
        }
        
        console.log(`Sending request to delete certificate with SAN: ${selectedCertificateSan} and reason: ${reason}`);
        
        axios.delete(`http://localhost:3001/api/certificates/${selectedCertificateSan}`, { data: { reason } })
            .then(() => {
                const updatedData = data.filter((row) => row.san !== selectedCertificateSan);
                setFilteredData(updatedData);
                setData(updatedData);
                setSuccessMessage(`Successfully revoked certificate with SAN: ${selectedCertificateSan}`);
                setIsRevocationSuccessful(true);
                console.log(`Successfully deleted certificate with SAN: ${selectedCertificateSan}`);
            })
            .catch(error => {
                console.error('There was an error deleting the record!', error);
            });
    };

    const exportPDF = async () => {
        try {
            const response = await fetch('/download/pdf');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Certificates.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('There was an error downloading the PDF:', error);
        }
    };

    const exportCSV = async () => {
        try {
            const response = await fetch('/download/csv');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Certificates.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('There was an error downloading the CSV:', error);
        }
    };

    return (
        <div className="table-box">
            <h4>{AppConfig.table.tableboxheading}</h4>
            <div className="rows-per-page-container">
                {role === 'admin' && selectedOption === 'downloadcertificates' && (
                    <div className="download-buttons">
                        <button className="download-pdf-btn" onClick={exportPDF}>{AppConfig.table.pdfExport}</button>
                        <button className="download-csv-btn" onClick={exportCSV}>{AppConfig.table.csvExport}</button>
                    </div>
                )}
                <div className="rows-per-page">
                    <label htmlFor="rowsPerPage">{AppConfig.table.rowsPerPage}</label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>
                            CN<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'cn')}
                            />
                        </th>
                        <th>
                            CERTNAME<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'certname')}
                            />
                        </th>
                        <th>
                            CERTTYPE<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'certtype')}
                            />
                        </th>
                        <th>
                            CREATION DATETIME<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'creation_datetime')}
                            />
                        </th>
                        <th>
                            REQNAME<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'reqname')}
                            />
                        </th>
                        <th>
                            SAN<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'san')}
                            />
                        </th>
                        <th>
                            EXPIRATION DATETIME<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'expiration_datetime')}
                            />
                        </th>
                        <th>{AppConfig.table.actions}</th>
                    </tr>
                </thead>
                <tbody id="data-table">
                    {paginatedData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.cn}</td>
                            <td>{row.certname}</td>
                            <td>{row.certtype}</td>
                            <td>{formatDate(row.creation_datetime)}</td>
                            <td>{row.reqname}</td>
                            <td>{row.san}</td>
                            <td>{row.expiration_datetime}</td>
                            <td>
                                {selectedOption === 'downloadcertificates' && (
                                    <a href={`http://localhost:3001/api/certificates/download/${row.san}`} download>
                                        <button className="download-btn">{AppConfig.table.download}</button>
                                    </a>
                                )}
                                {role === 'admin' && selectedOption === 'revokecertificates' && (
                                    <button className="revoke-btn" onClick={() => handleRevoke(row.san)}>
                                        {AppConfig.table.revoke}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                <span>Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}</span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}>Next</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Confirm Revocation"
                className="modal"
                overlayClassName="overlay"
            >
                {isRevocationSuccessful ? (
                    <div>
                        <h2>{successMessage}</h2>
                        <button onClick={closeModal}>{AppConfig.table.close}</button>
                    </div>
                ) : (
                    <div>
                        <h2>{AppConfig.table.confirmRevocation}</h2>
                        <p>{AppConfig.table.reasonForRevocation}</p>
                        <div>
                            <select 
                                value={reason} 
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setIsSelectError(false); // Reset error state on change
                                }}
                                className={isSelectError ? 'error' : ''}
                            >
                                <option value="" disabled>Select a reason</option>
                                {reasons.map((reason, index) => (
                                    <option key={index} value={reason}>{reason}</option>
                                ))}
                            </select>
                            {isSelectError && <p className="error-message">{errorMessage}</p>}
                        </div>
                        <div className="modal-buttons">
                            <button onClick={submitRevoke}>{AppConfig.table.submit}</button>
                            <button onClick={closeModal}>{AppConfig.table.cancel}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const Footer = () => {
    return (
        <footer>
            <div className="top">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <a href="#">Home</a><a href="#">Blog</a><a href="#">Contact</a><a href="#">Feedback</a>
            </div>
            <div className="separator"></div>
            <div className="bottom">
                <div className="links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookies Setting</a>
                </div>
            </div>
        </footer>
    );
};

const Dashboard = ({ role, setRole }) => {
    const [selectedOption, setSelectedOption] = useState('downloadcertificatesbundle');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [CN, setCN] = useState('');
    const [CertName, setCertName] = useState('');
    const [CertType, setCertType] = useState('');
    const [ReqName, setReqName] = useState('');
    const [SAN, setSAN] = useState('');
    const [expiration_datetime, setexpiration_datetime] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSubscriber, setSelectedSubscriber] = useState('');
    const [selectedSubscription, setSelectedSubscription] = useState('');

    // const [role, setRole] = useState('admin');

    useEffect(() => {
        axios.get('http://localhost:3001/api/certificates')
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    
    

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    };

    const handleDateFilter = () => {
        let params = {};
    
        if (filterType === 'date') {
            params = {
                day: day || null,
                month: month || null,
                year: year || null
            };
        } else if (filterType === 'past6months') {
            params = {
                past6months: true
            };
        }
    
        // Fetch filtered data from the backend
        axios.get('http://localhost:3001/api/certificates/filter', { params })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setFilteredData(response.data);
                    setShowTable(true);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
            });
    };

    const handlePast6MonthsFilter = () => {
        axios.get('http://localhost:3001/api/certificates/past6months')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setFilteredData(response.data);
                    setShowTable(true);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching past 6 months data:', error.response ? error.response.data : error.message);
            });
    };

    const handleDateRangeFilter = () => {
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
    
        axios.get('http://localhost:3001/api/certificates/date-range', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        })
        .then(response => {
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                setFilteredData(response.data);
                setShowTable(true);
            } else {
                console.error('Unexpected data format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching date range data:', error.response ? error.response.data : error.message);
        });
    };

    

    const handleSearch = (searchTerm, column) => {
        if (searchTerm.trim() === '') {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter((row) => {
            const matchesSubscriber = selectedSubscriber ? row.subscriber === selectedSubscriber : true;
            const matchesSubscription = selectedSubscription ? row.ssb === selectedSubscription : true;

            return row[column]?.toLowerCase().includes(searchTerm.toLowerCase()) && matchesSubscriber && matchesSubscription;
        });
        setFilteredData(filtered);
    };

    const handleShowTable = () => {
        let params = {
            subscriber: selectedSubscriber,
            subscription: selectedSubscription,
            filterType: filterType,
            day: day || null,
            month: month || null,
            year: year || null,
            startDate: startDate || null,
            endDate: endDate || null
        };

        console.log('Request Params:', params);

        axios.get('http://localhost:3001/api/certificates/filter', { params })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setShowFilterOptions((prevShowFilterOptions) => !prevShowFilterOptions);
                    setFilteredData(response.data);
                    setShowTable(true);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
            });
    };
    
    // Make sure handleShowTable is called after state updates
    
    
    
    

    const handleAdvanceDateFilter = () => {
        let params = {
            day: day || null,
            month: month || null,
            year: year || null,
            CN: CN || null,
            CertName: CertName || null,
            CertType: CertType || null,
            ReqName: ReqName || null,
            SAN: SAN || null,
            expiration_datetime: expiration_datetime || null,
        };
    
        // Fetch filtered data from the backend
        axios.get('http://localhost:3001/api/certificates/advanced-filter', { params })
            .then(response => {
                if (Array.isArray(response.data)) {
                    setFilteredData(response.data);
                    setShowTable(true);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
            });
    };

    const toggleFilterOptions = () => {
        setShowFilterOptions((prevShowFilterOptions) => !prevShowFilterOptions);
        setShowTable(false);
    };

    const handlecabundleDownload = () => {
        const link = document.createElement('a');
        link.href = 'http://localhost:3001/download/ca_bundle';
        link.download = 'CA_BUNDLE_CERTIFICATE.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleHomeClick = () => {
        setSelectedOption('downloadcertificatesbundle');
        
    };
    
    

    return (
        <div className="App">
            <Navbar role={role} handleHomeClick={handleHomeClick}/>
            <div className="container">
                <Sidebar role={role} selected={selectedOption} setSelected={setSelectedOption} />
                <div className="content">
                    <div className="outer-box">
                        {selectedOption === 'downloadcertificates' && (
                            <h4>{AppConfig.outerbox.downloadblockheading}</h4>
                        )}
                        {selectedOption === 'revokecertificates' && (
                            <h4>{AppConfig.outerbox.revokeblockheading}</h4>
                        )}
                        {selectedOption === 'downloadcertificatesbundle' && (
                            <div className="ca-bundle-button-container">
                                <button className="download-bundle-btn" onClick={handlecabundleDownload}>
                                    {AppConfig.blocks.downloadcabundle}
                                </button>
                            </div>
                        )}
                        {role === 'user' && (
                        <Blocks
                                selected={selectedOption}
                                selectedSubscriber={selectedSubscriber}
                                setSelectedSubscriber={setSelectedSubscriber}
                                selectedSubscription={selectedSubscription}
                                setSelectedSubscription={setSelectedSubscription}
                            />
                        )}
                        <div className="table-container">
                            {(selectedOption === 'downloadcertificates' || selectedOption === 'revokecertificates') && (
                                <>
                                {role === 'user' && (
                                    <button className="show-table-button" onclick={handleShowTable}>
                                        {showFilterOptions ? 'Hide Certificates' : 'Show Certificates'}
                                    </button>
                                )}
                                {role === 'admin' && (
                                    <button className="show-table-button" onClick={toggleFilterOptions}>
                                    {showFilterOptions ? 'Hide Certificates' : 'Show Certificates'}
                                </button>
                                )}
                                    {showFilterOptions && (
                                        <div className="filter-container">
                                            <label>
                                                {AppConfig.table.filterBy}
                                                <select value={filterType} onChange={handleFilterTypeChange}>
                                                    <option value="">{AppConfig.table.filterOptions.filterplaceholder}</option>
                                                    <option value="date">{AppConfig.table.filterOptions.date}</option>
                                                    <option value="daterange">{AppConfig.table.filterOptions.daterange}</option>
                                                    <option value="past6months">{AppConfig.table.filterOptions.past6months}</option>
                                                    <option value="advancesearch">{AppConfig.table.filterOptions.advancesearch}</option>
                                                </select>
                                            </label>
                                            {filterType === 'date' && (
                                                <div className="date-filter">
                                                    <input
                                                        type="number"
                                                        placeholder="Day"
                                                        value={day}
                                                        onChange={(e) => setDay(e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Month"
                                                        value={month}
                                                        onChange={(e) => setMonth(e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Year"
                                                        value={year}
                                                        onChange={(e) => setYear(e.target.value)}
                                                    />
                                                    <button className="Filter-btn" onClick={handleDateFilter}>Filter</button>
                                                </div>
                                            )}
                                        {filterType === 'daterange' && (
                                            <div className="date-range-filter">
                                                <label>Start Date:
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                                </label>
                                                <label>End Date:
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                />
                                                </label>
                                                <button className="Filter-btn" onClick={handleDateRangeFilter}>
                                                    Filter by Date Range
                                                </button>
                                            </div>
                                        )}
                                        {filterType === 'past6months' && (
                                                <button className="Filter6months-btn" onClick={handleDateFilter}>Filter Past 6 Months</button>
                                            )}
                                        {filterType === 'advancesearch' && (
                                            <div className="advance-filter">
                                                <div className="filter-item">
                                                    <label>Creation Date: </label>
                                                    <input
                                                        type="number"
                                                        placeholder="Day"
                                                        value={day}
                                                        onChange={(e) => setDay(e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Month"
                                                        value={month}
                                                        onChange={(e) => setMonth(e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Year"
                                                        value={year}
                                                        onChange={(e) => setYear(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>CN: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="CN"
                                                        value={CN}
                                                        onChange={(e) => setCN(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>CertName: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="CertName"
                                                        value={CertName}
                                                        onChange={(e) => setCertName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>CertType: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="CertType"
                                                        value={CertType}
                                                        onChange={(e) => setCertType(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>ReqName: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="ReqName"
                                                        value={ReqName}
                                                        onChange={(e) => setReqName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>SAN: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="SAN"
                                                        value={SAN}
                                                        onChange={(e) => setSAN(e.target.value)}
                                                    />
                                                </div>
                                                <div className="filter-item">
                                                    <label>expiration_datetime: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="expiration_datetime"
                                                        value={expiration_datetime}
                                                        onChange={(e) => setexpiration_datetime(e.target.value)}
                                                    />
                                                </div>
                                                <button className="Filter-btn" onClick={handleAdvanceDateFilter}>Filter</button>
                                            </div>
                                        )}
                                        </div>
                                    )}
                                    {showTable && 
                                        <Table 
                                            role={role} 
                                            selectedOption={selectedOption} 
                                            data={filteredData} 
                                            onSearch={handleSearch}
                                            setData={setData}
                                            setFilteredData={setFilteredData}
                                            filteredData={filteredData}
                                            showRevokeButtons={selectedOption === 'revokecertificates'}
                                        />}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            <Footer />    
        </div>
    );
};



const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<RoleSelection />} />
                    <Route path="/dashboard" element={<DashboardWrapper />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

const DashboardWrapper = () => {
    const location = useLocation();
    const role = location.state?.role || 'admin' || 'user'; // Ensure 'user' is the fallback role only if needed

    return <Dashboard role={role} />;
};

export default App;