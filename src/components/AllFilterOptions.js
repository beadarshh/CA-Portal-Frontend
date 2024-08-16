/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import './componentscss/FilterOptions.css';

const FilterOptions = ({ setFilteredData, setShowTable }) => {
  const [filterOption, setFilterOption] = useState('');
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

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleDateFilter = () => {
    let params = {};

    if (filterOption === 'date') {
      params = {
        day: day || null,
        month: month || null,
        year: year || null
      };
    } else if (filterOption === 'past6months') {
      params = {
        past6months: true
      };
    }

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

  const handleDateRangeFilter = () => {
    axios.get('http://localhost:3001/api/certificates/date-range', {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
      .then(response => {
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
        console.error('Error fetching advance filter data:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="filter-options-container">
      <h5>Filter By</h5>
      <label htmlFor="filterOption">Filter Option:</label>
      <select id="filterOption" value={filterOption} onChange={handleFilterOptionChange}>
        <option value="">Select Filter Option</option>
        <option value="date">Date</option>
        <option value="past6months">Past 6 Months</option>
        <option value="dateRange">Date Range</option>
        <option value="advanced">Advanced Filter</option>
        <option value="sansearch">Search by SAN</option>
      </select>

      {filterOption === 'date' && (
        <div>
          <label htmlFor="day">Day:</label>
          <input
            type="number"
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
          <label htmlFor="month">Month:</label>
          <input
            type="number"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button className="apply-filter-btn" onClick={handleDateFilter}>
            Apply Filter
          </button>
        </div>
      )}

      {filterOption === 'past6months' && (
        <button className="apply-filter-btn" onClick={handleDateFilter}>
          Apply Past 6 Months Filter
        </button>
      )}

      {filterOption === 'dateRange' && (
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="apply-filter-btn" onClick={handleDateRangeFilter}>
            Apply Date Range Filter
          </button>
        </div>
      )}

      {filterOption === 'advanced' && (
        <div>
          <label htmlFor="CN">CN:</label> 
          <input
            type="text"
            id="CN"
            value={CN}
            onChange={(e) => setCN(e.target.value)}
          />
          <label htmlFor="CertName">Cert Name:</label> 
          <input
            type="text"
            id="CertName"
            value={CertName}
            onChange={(e) => setCertName(e.target.value)}
          />
          <label htmlFor="CertType">Cert Type:</label>
          <input
            type="text"
            id="CertType"
            value={CertType}
            onChange={(e) => setCertType(e.target.value)}
          />
          <label htmlFor="ReqName">Req Name:</label> 
          <input
            type="text"
            id="ReqName"
            value={ReqName}
            onChange={(e) => setReqName(e.target.value)}
          /> 
          <label htmlFor="SAN">SAN:</label>
          <input
            type="text"
            id="SAN"
            value={SAN}
            onChange={(e) => setSAN(e.target.value)}
          />
          <label htmlFor="expiration_datetime">Expiration Date:</label>
          <input
            type="date"
            id="expiration_datetime"
            value={expiration_datetime}
            onChange={(e) => setexpiration_datetime(e.target.value)}
          />
          <button className="apply-filter-btn" onClick={handleAdvanceDateFilter}>
            Search
          </button>
        </div>
      )}
      {filterOption === 'sansearch' && (
        <div>
          
          <label htmlFor="SAN">SAN:</label>
          <input
            type="text"
            id="SAN"
            value={SAN}
            onChange={(e) => setSAN(e.target.value)}
          />
          <button className="apply-filter-btn" onClick={handleAdvanceDateFilter}>
            Search
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
