/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterOptions from './FilterOptions';
import AppConfig from '../config';
import Table from './Table';
import './componentscss/DownloadIssuedCertificate.css';

const DownloadIssuedCertificate = ({filterParams}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const jwtToken = localStorage.getItem('authToken');
  const headers = { "Authorization": `Bearer ${jwtToken}` };


  // useEffect(() => {
  //   axios.get('http://localhost:8080/certificates/certs')
  //     .then(response => {
  //       setData(response.data);
  //       setFilteredData(response.data);
  //     })
  //     .catch(error => {
  //       console.error('There was an error fetching the data!', error);
  //     });
  // }, []);

  // const downloadFile = (type) => {
  //   setLoading(true);
  //   let url = `http://localhost:8080/certificates/cert-list-${type}`;
  //   let params = { ...filterParams };

  //   axios.get(url, { headers, params, responseType: 'blob' })
  //     .then(response => {
  //       const fileURL = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
  //       const fileName = `certificates.${type}`;
  //       const link = document.createElement('a');
  //       link.href = fileURL;
  //       link.setAttribute('download', fileName);
  //       document.body.appendChild(link);
  //       link.click();
  //     })
  //     .catch(error => {
  //       console.error('Error downloading file:', error.response ? error.response.data : error.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  return (
    <div className='outerbox'>
    <div className="content">
      <h4>{AppConfig.outerbox.downloadblockheading}</h4>
      <FilterOptions setFilteredData={setFilteredData} setShowTable={setShowTable} setLoading={setLoading}  />
      
      {showTable && 
      <>
        {/* <div className='download-buttons'>
          <div>
              <button className="download-pdf-btn" onClick={() => downloadFile('pdf')}>
                Download as PDF
              </button>
              <button className="download-csv-btn" onClick={() => downloadFile('csv')}>
                Download as CSV
              </button>
            </div>
        </div> */}
        <Table 
          data={filteredData} 
          role='user' // or dynamically determine this value
          selectedOption="downloadcertificates" // this should match the condition for rendering download buttons
          setFilteredData={setFilteredData} 
          setData={setData} 
          loading={loading} // Pass loading state to Table
          showDownloadButtons={true}
        />
        </>
        }
    </div>
    </div>
  );
};

export default DownloadIssuedCertificate;
