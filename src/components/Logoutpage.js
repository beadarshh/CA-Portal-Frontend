import React from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './componentscss/Logoutpage.css'; // Import the CSS file 
 
const Logoutpage = () => { 
  const navigate = useNavigate(); 
 
  React.useEffect(() => { 
    const timer = setTimeout(() => { 
      navigate('/'); // Change this to the desired route 
    }, 2* 1000); 
 
    return () => clearTimeout(timer); 
  }, [navigate]); 
 
  return ( 
    <div className="logout-success-container"> 
      <h2>You have successfully logged out!</h2> 
      <p>You will be redirected shortly...</p> 
    </div> 
  ); 
}; 
 
export default Logoutpage;