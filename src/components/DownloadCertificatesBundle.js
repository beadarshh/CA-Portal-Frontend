import React from 'react';
import axios from 'axios';
import AppConfig from '../config';
import './componentscss/DownloadCertificateBundle.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider'; 

const DownloadCertificatesBundle = () => {
  const navigate = useNavigate(); 
  const { setIsAuthenticated } = useAuth();
  const handleCabundleDownload = () => {

    const jwtToken = localStorage.getItem('authToken');
    const headers = { "Authorization": `Bearer ${jwtToken}` };

    axios.get('http://localhost:8080/certificates/ca-bundle', {
      headers,
      responseType: 'blob' // This ensures the response is handled as a file
    })
      .then(response => {
        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'CA_BUNDLE_CERTIFICATE.crt');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('Failed to download file:', response.status);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // Handle 401 Unauthorized error
          Cookies.remove('authToken'); // Clear authentication token
          sessionStorage.removeItem('role'); // Clear role data
          // setIsAuthenticated(false); // Update authentication state (if applicable)
          navigate('/logoutpage'); // Redirect to the logout page
        } else {
          console.error('Error downloading CA Bundle:', error.response ? error.response.data : error.message);
        }
      });
  };

  return (
    <div className='outerbox'>
    <div className="ca-bundle-button-container">
      <button className="download-bundle-btn" onClick={handleCabundleDownload}>
        {AppConfig.blocks.downloadcabundle}
      </button>
    </div>
    </div>
  );
};

export default DownloadCertificatesBundle;
