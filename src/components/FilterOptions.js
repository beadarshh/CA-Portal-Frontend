// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import axios from 'axios';
// import './componentscss/FilterOptions.css';

// const FilterOptions = ({ setFilteredData, setShowTable, setLoading }) => {
//   const [filterOption, setFilterOption] = useState('');
//   const [day, setDay] = useState('');
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');
//   const [CN, setCN] = useState('');
//   const [CertName, setCertName] = useState('');
//   const [CertType, setCertType] = useState('');
//   const [ReqName, setReqName] = useState('');
//   const [SAN, setSAN] = useState('');
//   const [expiration_datetime, setexpiration_datetime] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const handleFilterOptionChange = (event) => {
//     setFilterOption(event.target.value);
//   };

//   // const handleDateFilter = () => {
//   //   setLoading(true);
//   //   let params = {};

//   //   if (filterOption === 'date') {
//   //     params = {
//   //       day: day || null,
//   //       month: month || null,
//   //       year: year || null
//   //     };
//   //   } else if (filterOption === 'past6months') {
//   //     params = {
//   //       past6months: true
//   //     };
//   //   }

//   //   axios.get('http://localhost:3001/api/certificates/filter', { params })
//   //     .then(response => {
//   //       if (Array.isArray(response.data)) {
//   //         setFilteredData(response.data);
//   //         setShowTable(true);
//   //       } else {
//   //         console.error('Unexpected data format:', response.data);
//   //       }
//   //     })
//   //     .catch(error => {
//   //       console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
//   //     })
//   //     .finally(() => {
//   //       setLoading(false); // Set loading to false after fetching data
//   //     });
//   // };
//   const jwtToken = localStorage.getItem('authToken')
//   const headers= {"Authorization": "Bearer"+ jwtToken}
//   const handleDateRangeFilter = () => {
//     setLoading(true);
//     axios.get('http://localhost:8080/certificates/certs', {
//       params: {
//         startDate: startDate,
//         endDate: endDate
//       },
//       headers: headers

//     })
//       .then(response => {
//         if (Array.isArray(response.data)) {
//           setFilteredData(response.data);
//           setShowTable(true);
//         } else {
//           console.error('Unexpected data format:', response.data);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching date range data:', error.response ? error.response.data : error.message);
//       })
//       .finally(() => {
//         setLoading(false); // Set loading to false after fetching data
//       });
//   };

//   const handleAdvanceDateFilter = () => {
//     setLoading(true);
//     let params = {
//       SAN: SAN || null,
//     };

//     axios.get('http://localhost:3001/api/certificates/advanced-filter', { params })
//       .then(response => {
//         if (Array.isArray(response.data)) {
//           setFilteredData(response.data);
//           setShowTable(true);
//         } else {
//           console.error('Unexpected data format:', response.data);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching advance filter data:', error.response ? error.response.data : error.message);
//       })
//       .finally(() => {
//         setLoading(false); // Set loading to false after fetching data
//       });
//   };

//   return (
//     <div className="filter-options-container">
//       <h5>Filter By</h5>
//       <label htmlFor="filterOption">Filter Option:</label>
//       <select id="filterOption" value={filterOption} onChange={handleFilterOptionChange}>
//         <option value="">Select Filter Option</option>
//         <option value="dateRange">Date Range</option>
//         <option value="sansearch">Search by SAN</option>
//       </select>

//       {filterOption === 'dateRange' && (
//         <div>
//           <label htmlFor="startDate">Start Date:</label>
//           <input
//             type="date"
//             id="startDate"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//           <label htmlFor="endDate">End Date:</label>
//           <input
//             type="date"
//             id="endDate"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//           <button className="apply-filter-btn" onClick={handleDateRangeFilter}>
//             Apply Date Range Filter
//           </button>
//         </div>
//       )}

//       {filterOption === 'sansearch' && (
//         <div>
          
//           <label htmlFor="SAN">SAN:</label>
//           <input
//             type="text"
//             id="SAN"
//             value={SAN}
//             onChange={(e) => setSAN(e.target.value)}
//           />
//           <button className="apply-filter-btn" onClick={handleAdvanceDateFilter}>
//             Search
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterOptions;
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import './componentscss/FilterOptions.css';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthProvider'; 
import Cookies from 'js-cookie';
const FilterOptions = ({ setFilteredData, setShowTable, setLoading, selectedOption, role }) => {
  const [filterOption, setFilterOption] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [SAN, setSAN] = useState('');
  const [showDownloadButtons, setShowDownloadButtons] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [isSelectError, setIsSelectError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 
    const { setIsAuthenticated } = useAuth();
  const jwtToken = Cookies.get('authToken');
  const headers = { "Authorization": `Bearer ${jwtToken}` };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const formatDateForApi = (date) => {
    return new Date(date).toISOString();
  };

  const handleFilter = () => {
    setLoading(true);
    let params = {};

    switch (filterOption) {
      case 'dateRange':
        if (!startDate || !endDate) {
          setIsSelectError(true);
          setErrorMessage('Select Date Range');
          console.log('Date Range Not Selected');
          return;
      }
        else {params.start_date = formatDateForApi(startDate);
        params.end_date = formatDateForApi(endDate);
        break;
        }
      case 'past6months':
        const currentDate = new Date();
        const past6MonthsDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        params.start_date = formatDateForApi(past6MonthsDate);
        params.end_date = formatDateForApi(new Date());
        break;
      case 'monthly':
        if (year && month) {
          const monthZeroBased = month - 1;
          const startOfMonth = new Date(`${year}-${String(monthZeroBased + 1).padStart(2, '0')}-01T00:00:00.000Z`);
          const lastDay = new Date(year, monthZeroBased + 1, 0).getDate();
          const endOfMonth = new Date(`${year}-${String(monthZeroBased + 1).padStart(2, '0')}-${lastDay}T23:59:59.999Z`);

          params.start_date = formatDateForApi(startOfMonth);
          params.end_date = formatDateForApi(endOfMonth);
        }
        break;
      case 'sansearch':
        params.san = SAN;
        if (!SAN) {
          setIsSelectError(true);
          setErrorMessage('Enter San');
          console.log('San Not Entered');
          return;
      }
        break;
      default:
        break;
    }
    setFilterParams(params);

    axios.get('http://localhost:8080/certificates/certs', { headers, params })
  .then(response => {
    if (response.data && response.data._embedded && response.data._embedded.certificateList) {
      setFilteredData(response.data._embedded.certificateList);
      setShowTable(true);
      setShowDownloadButtons(true); // Show download buttons
    } else {
      console.error('Unexpected data format:', response.data);
      setShowDownloadButtons(false);
      setIsSelectError(true);
      setErrorMessage("No Data Found");
      setShowTable(false); // Hide table if unexpected data format
    }
  })
  .catch(error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized error
      Cookies.remove('authToken'); // Clear authentication token
      sessionStorage.removeItem('role'); // Clear role data
      setIsAuthenticated(false); // Update authentication state
      navigate('/logoutpage'); // Redirect to the logout page
      
    } else if (error.response && error.response.status === 204) {
      // Handle 204 No Content error
      setIsSelectError(true);
      setErrorMessage("No Data Found"); // Display error message
      setShowTable(false); // Hide table
      setShowDownloadButtons(false);
    } else {
      console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
      setShowTable(false); // Hide table in case of other errors
      setShowDownloadButtons(false);
    }
  })
  .finally(() => {
    setLoading(false);
  });

  };

  const downloadFile = (type) => {
    setLoading(true);
    let url = `http://localhost:8080/certificates/cert-list-${type}`;
    let params = { ...filterParams };

    axios.get(url, { headers, params, responseType: 'blob' })
      .then(response => {
        const fileURL = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        const fileName = `certificates.${type}`;
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // Navigate to the logout page if 401 Unauthorized error occurs
          Cookies.remove('authToken'); // Clear authentication token
          sessionStorage.removeItem('role'); // Clear role data
          setIsAuthenticated(false); // Update authentication state
          navigate('/logoutpage');
        } else {
          console.error('Error downloading file:', error.response ? error.response.data : error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const storedRole = sessionStorage.getItem('role');


  return (
    <div className="filter-options-container">
      <h5>Filter By</h5>
      <label htmlFor="filterOption">Filter Option:</label>
      <select id="filterOption" value={filterOption} onChange={handleFilterOptionChange}>
        <option value="">Select Filter Option</option>
        <option value="dateRange">Creation Date Range</option>
        {/* <option value="past6months">Past 6 Months</option>
        <option value="monthly">Monthly</option> */}
        <option value="sansearch">Subject Alternative Name</option>
      </select>
  
      {filterOption === 'dateRange' && (
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setIsSelectError(false);
              setErrorMessage('');
            }}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setIsSelectError(false);
              setErrorMessage('');
            }}
          />
          {isSelectError && <div className="error-message">{errorMessage}</div>}
          <button className="apply-filter-btn" onClick={handleFilter}>
            Apply Date Range Filter
          </button>
        </div>
      )}
  
      {filterOption === 'past6months' && (
        <button className="apply-filter-btn" onClick={handleFilter}>
          Apply Past 6 Months Filter
        </button>
      )}
  
      {filterOption === 'monthly' && (
        <div>
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
          <button className="apply-filter-btn" onClick={handleFilter}>
            Apply Monthly Filter
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
            onChange={(e) => {
              setSAN(e.target.value);
              setIsSelectError(false);
              setErrorMessage('');
            }}
            required
          />
          {isSelectError && <div className="error-message">{errorMessage}</div>}
          <button className="apply-filter-btn" onClick={handleFilter}>
            Search by SAN
          </button>
        </div>
      )}
  
      {storedRole === 'admin' && showDownloadButtons && (
        <div className='download-buttons'>
          <div>
            <button className="apply-filter-btn" onClick={() => downloadFile('pdf')}>
              Download as PDF
            </button>
            <button className="apply-filter-btn" onClick={() => downloadFile('csv')}>
              Download as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default FilterOptions;
