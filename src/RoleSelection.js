/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthProvider'; 
import AppConfig from './config'; 
import './RoleSelection.css'; 
import axios from 'axios';
import Cookies from 'js-cookie';

const RoleSelection = () => { 
    const navigate = useNavigate(); 
    const { setIsAuthenticated } = useAuth(); 
    const [headerInput, setHeaderInput] = useState(''); 
    const [role, setRole] = useState(null);
    const [sessionMap, setSessionMap] = useState(new Map());
    //const setSessionMapMemoized = useCallback((newMap) => {
    //     setSessionMap(newMap);
    //   }, [setSessionMap]); // Add setSessionMap as a dependency

    const handleLogout = useCallback(() => {
        Cookies.remove('authToken');
        sessionStorage.removeItem('role');
        setIsAuthenticated(false);
        navigate('/');
    }, [navigate, setIsAuthenticated]);

    // console.log('setSessionMap:', setSessionMap);
    // const updateSessionMap = useCallback((sessionId1, sessionId2) => {
    //     try{setSessionMapMemoized((prevMap) => {
    //     console.log('Inside setSessionMap...');
    //     const updatedMap = { ...prevMap, [sessionId1]: sessionId2 };
    //     console.log('Session Map updated:', updatedMap);
    //     console.log(`sessionId ${sessionId1} is now mapped to ${sessionId2}`);
    //     return updatedMap;
    //     });
    //   }catch (error) {
    //     console.error('Error updating session map:', error);
    //   }
    // }, [setSessionMapMemoized]);

    useEffect(() => {
        const handleLogin = async () => {
            try {
                const sessionId1 = 'abc';
                const response = await axios.get('http://localhost:8080/certificates/login', {
                    headers: {
                        'Authorization': headerInput
                    },
                    params: {
                        sessionId: sessionId1
                    }
                });

                if (response.status === 200) {
                    const { jwtToken } = response.data;
                    Cookies.set('authToken', jwtToken);
                    setIsAuthenticated(true);

                    // Call the validate API
                    const validateResponse = await axios.get('http://localhost:8080/certificates/validate', {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    });

                    const { privileges } = validateResponse.data;

                    // Determine role based on privileges
                    const determinedRole = privileges.includes('a3') ? 'admin' : 'user';
                    setRole(determinedRole);
                    sessionStorage.setItem('role', determinedRole);
                    localStorage.setItem('usersessionId', sessionId1);

                    const sessionId2 = Math.random().toString(36).substring(2, 15);
                    console.log(`Generated sessionId2: ${sessionId2}`);
    
                    setSessionMap(prevMap => {
                        const newMap = new Map(prevMap);
                        newMap.set(sessionId1, sessionId2);
                        console.log('New Map:', newMap);
                        return newMap;
                    });
    
                    console.log('Session Map created:', sessionMap.has(sessionId1) ? 'Yes' : 'No');
                } else {
                    console.error('Login failed with status:', response.status);
                }
                //     navigate('/dashboard', { state: { role: determinedRole } });
                // } else {
                //     console.error('Login failed with status:', response.status);
                // }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    handleLogout(); // Handle 401 Unauthorized
                } else {
                    console.error('Error during login:', error);
                }
            }
        };
    
        if (headerInput) { 
            handleLogin(); 
        } 
    }, [headerInput, navigate, setIsAuthenticated, handleLogout, sessionMap]);
    
    

    useEffect(() => { 
        const authToken = Cookies.get('authToken'); 
        const storedRole = sessionStorage.getItem('role');
         
        if (authToken && storedRole) { 
            setIsAuthenticated(true); 
            navigate('/dashboard', { state: { role: storedRole } }); 
        } else { 
            setIsAuthenticated(false); 
        } 
        // Log the current state of sessionMap
        // console.log('Current Session Map in useEffect:', sessionMap);
        
        // const sessionIdToCheck = localStorage.getItem('usersessionId');
        // if (sessionIdToCheck && sessionMap[sessionIdToCheck]) {
        //     console.log(`sessionId ${sessionIdToCheck} is in the map with value: ${sessionMap[sessionIdToCheck]}`);
        // } else {
        //     console.log(`sessionId ${sessionIdToCheck} is not in the map.`
        
        
    }, [navigate, setIsAuthenticated, sessionMap]);

    // useEffect(() => {
    //     console.log('Session Map:', sessionMap);
    //     const sessionIdToCheck = 'abc'; // Replace with the sessionId you want to check
    //     if (sessionMap[sessionIdToCheck]) {
    //         console.log(`sessionId ${sessionIdToCheck} is in the map with value: ${sessionMap[sessionIdToCheck]}`);
    //     } else {
    //         console.log(`sessionId ${sessionIdToCheck} is not in the map.`);
    //     }
    // }, [sessionMap]);

    const handleHeaderInputChange = (e) => { 
        setHeaderInput(e.target.value); 
    };

    return ( 
        <div className="role-selection"> 
            <div className="role-selection-box"> 
                <h2>{AppConfig.roleSelection.selectRole}</h2> 
                <input 
                    type="text" 
                    placeholder="Enter Authorization header" 
                    value={headerInput} 
                    onChange={handleHeaderInputChange} 
                /> 
            </div> 
        </div>
    ); 
}; 

export default RoleSelection;
