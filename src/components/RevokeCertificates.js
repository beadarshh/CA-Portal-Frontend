/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterOptions from './FilterOptions';
import Table from './Table';
import AppConfig from '../config';
import './componentscss/RevokeCertificates.css';


const RevokeCertificates = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   axios.get('http://localhost:3001/api/certificates')
  //     .then(response => {
  //       setData(response.data);
  //       setFilteredData(response.data);
  //     })
  //     .catch(error => {
  //       console.error('There was an error fetching the data!', error);
  //     });
  // }, []);

  return (
    <div className='outerbox'>
    <div className="content">
      <h4>{AppConfig.outerbox.revokeblockheading}</h4>
      <FilterOptions setFilteredData={setFilteredData} setShowTable={setShowTable} setLoading={setLoading} />
      {showTable && 
        <Table 
          data={filteredData} 
          showRevokeButtons 
          role="admin" // or dynamically determine this value
          selectedOption="revokecertificates" // this should match the condition for rendering revoke button
          setFilteredData={setFilteredData} 
          setData={setData} 
          loading={loading} // Pass loading state to Table
        />}
    </div>
    </div>
  );
};

export default RevokeCertificates;
