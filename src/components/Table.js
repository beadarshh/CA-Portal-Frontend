import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AppConfig from '../config';
import './componentscss/Table.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider'; 
import Cookies from 'js-cookie';
Modal.setAppElement('#root');

const Table = ({ data, setData, setFilteredData, role, filteredData, selectedOption, loading }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCertificateSan, setSelectedCertificateSan] = useState(null);
    const [reason, setReason] = useState('');
    const [isSelectError, setIsSelectError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filteredSearchData, setFilteredSearchData] = useState(data);
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
    const [errorRevokeMessage, seterrorRevokeMessage] = useState('');
    const [errorRevokeModalIsOpen, seterrorRevokeModalIsOpen] = useState(false);
    const navigate = useNavigate(); 
    const { setIsAuthenticated } = useAuth();



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
        if (isNaN(d.getTime())) {
            // Return a default value or an empty string if the date is invalid
            return '';
        }
        return d.toISOString().split('T')[0]; // Formats the date as yyyy-mm-dd
    };
    

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredSearchData.slice(startIndex, startIndex + rowsPerPage);

    const handleRevoke = (san) => {
        console.log(`Revoke button clicked for SAN: ${san}`);
        setSelectedCertificateSan(san);  
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedCertificateSan(null);
        setReason('');
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

        const encodedSan = encodeURIComponent(selectedCertificateSan);
    const encodedReason = encodeURIComponent(reason);
    
    console.log(`Sending request to delete certificate with SAN: ${encodedSan} and reason: ${encodedReason}`);
    const authToken = Cookies.get('authToken');

    axios.delete(`http://localhost:8080/certificates/certs?san=${encodedSan}&reason=${encodedReason}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
        })
        .then(() => {
            const updatedData = data.filter((row) => row.san !== selectedCertificateSan);
            setFilteredData(updatedData);
            setData(updatedData);
            closeModal();
            console.log(`Successfully deleted certificate with SAN: ${selectedCertificateSan}`);
            setSuccessMessage('Certificate revoked successfully');
            setSuccessModalIsOpen(true); // Open the success modal
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                // Handle 401 Unauthorized error
                Cookies.remove('authToken'); // Clear authentication token
                sessionStorage.removeItem('role'); // Clear role data
                navigate('/logoutpage'); // Redirect to the logout page
            } else {
                console.error('Error Revoking Certificate:', error.response ? error.response.data : error.message);
                seterrorRevokeMessage('Error Revoking Certificate');
                seterrorRevokeModalIsOpen(true); // Open the error modal
            }
        });
    };
    

const downloadCertificate = (san) => {
    const authToken = Cookies.get('authToken');
    // const navigate = useNavigate(); // Initialize the navigate function
    const url = `http://localhost:8080/certificates/download-certs?san=${san}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.blob();  // Convert to a blob for file download
        } else if (response.status === 401) {
            // Handle 401 Unauthorized error
            Cookies.remove('authToken'); // Clear authentication token
            sessionStorage.removeItem('role'); // Clear role data
            navigate('/logoutpage'); // Redirect to the logout page
            throw new Error('Unauthorized'); // Prevent further execution
        } else {
            throw new Error('Failed to download certificate');
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificate.crt`);  // Specify the file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    })
    .catch(error => {
        console.error('Error downloading certificate:', error.message);
    });
};

    

    

    const onSearch = (value, column) => {
        if (value.trim() === '') {
            // If search input is cleared, reset to original data
            setFilteredSearchData(data);
        } else {
            // Otherwise, filter based on the current search value
            const filtered = filteredSearchData.filter((row) =>
                row[column].toString().toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSearchData(filtered);
        }
        setCurrentPage(1); // Reset to the first page after filtering or clearing the search
    };

    useEffect(() => {
        setFilteredSearchData(data);
    }, [data]);

    if (loading) {
        return <div className="loading-indicator">Loading...</div>; // Loading indicator
    }

    return (
        <div className="table-box">
            <h4>{AppConfig.table.tableboxheading}</h4>
            
            <div className="rows-per-page-container">
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
                        {/* <th>
                            CN<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'cn')}
                            />
                        </th> */}
                        <th>
                            CERTIFICATE NAME<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'certname')}
                            />
                        </th>
                        {/* <th>
                            CERTTYPE<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'certtype')}
                            />
                        </th> */}
                        <th>
                            CREATION DATE<br />
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => onSearch(e.target.value, 'creation_datetime')}
                            />
                        </th>
                        <th>
                            REQUEST NAME<br />
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
                            EXPIRATION DATE<br />
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
                    {/* <td>{row.cn}</td> */}
                    <td>{row.certname}</td>
                    {/* <td>{row.certtype}</td> */}
                    <td>{formatDate(row.dateissued)}</td>
                    <td>{row.reqname}</td>
                    <td>{row.san}</td>
                    <td>{formatDate(row.validity)}</td>
                    <td>
                        {selectedOption === 'downloadcertificates' && (
                            <button
                                className="download-btn"
                                onClick={() => downloadCertificate(row.san)}
                            >
                                {AppConfig.table.download}
                            </button>
                        )}
                        {role === 'admin' && selectedOption === 'revokecertificates' && (
                            <button
                                className="revoke-btn"
                                onClick={() => handleRevoke(row.san)}
                            >
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
                <span>Page {currentPage} of {Math.ceil(filteredSearchData.length / rowsPerPage)}</span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredSearchData.length / rowsPerPage)))}>Next</button>
            </div>
            {/* Revoke Certificate Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Reason for revocation"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <h2>{AppConfig.table.revokeReason}</h2>
                <div className="select-reason">
                    <label htmlFor="reason">{AppConfig.table.selectReason}</label>
                    <select
                        id="reason"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setIsSelectError(false);
                            setErrorMessage('');
                        }}
                        className={isSelectError ? 'error-select' : ''}
                    >
                        <option value="">{AppConfig.table.selectReasonPlaceholder}</option>
                        {reasons.map((reasonOption, idx) => (
                            <option key={idx} value={reasonOption}>{reasonOption}</option>
                        ))}
                    </select>
                    {isSelectError && <div className="error-message">{errorMessage}</div>}
                </div>
                <button onClick={submitRevoke}>{AppConfig.table.submit}</button>
                <button onClick={closeModal}>{AppConfig.table.cancel}</button>
            </Modal>

            {/* Success Message Modal */}
            <Modal
                isOpen={successModalIsOpen}
                onRequestClose={() => setSuccessModalIsOpen(false)}
                contentLabel="Success"
                className="success-modal"
                overlayClassName="custom-overlay"
            >
                <h2>{successMessage}</h2>
                {/* <button onClick={() => setSuccessModalIsOpen(false)}>{AppConfig.table.close}</button> */}
            </Modal>

            {/* Error Revoke Message Modal */}
            <Modal
                isOpen={errorRevokeModalIsOpen}
                onRequestClose={() => seterrorRevokeModalIsOpen(false)}
                contentLabel="error"
                className="success-modal"
                overlayClassName="custom-overlay"
            >
                <h2>{errorRevokeMessage}</h2>
                {/* <button onClick={() => seterrorRevokeModalIsOpen(false)}>{AppConfig.table.close}</button> */}
            </Modal>


        </div>
    );
};

export default Table;
