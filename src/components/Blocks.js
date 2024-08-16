// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AppConfig from '../config';
// import '../App.css';

// const Blocks = ({ selected, selectedSubscriber, setSelectedSubscriber, selectedSubscription, setSelectedSubscription }) => {
//     const [subscriptions, setSubscriptions] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:3001/api/subscriptions')
//             .then(response => {
//                 setSubscriptions(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the subscriptions data!', error);
//             });
//     }, []);

//     const handleSubscriberChange = (e) => {
//         setSelectedSubscriber(e.target.value);
//     };

//     const handleSubscriptionChange = (e) => {
//         setSelectedSubscription(e.target.value);
//     };

//     const uniqueSubscribers = [...new Set(subscriptions.map(sub => sub.subscriber))];
//     const filteredSSB = subscriptions.filter(sub => sub.subscriber === selectedSubscriber).map(sub => sub.ssb);
//     const uniqueSSB = [...new Set(filteredSSB)];

//     return (
//         <div className="blocks">
//             {(selected === 'downloadcertificates' || selected === 'revokecertificates') && (
//                 <>
//                     <div className="block">
//                         <h3>{'\u{1F465}'} {AppConfig.blocks.selectsubscriber.heading}</h3>
//                         <select value={selectedSubscriber} onChange={handleSubscriberChange}>
//                             <option value="">Select Subscriber</option>
//                             {uniqueSubscribers.map((subscriber, index) => (
//                                 <option key={index} value={subscriber}>{subscriber}</option>
//                             ))}
//                         </select>
//                     </div>
//                     {selectedSubscriber && (
//                         <div className="block">
//                             <h3>{'\u{1F4CB}'} {AppConfig.blocks.selectservice.heading}</h3>
//                             <select value={selectedSubscription} onChange={handleSubscriptionChange}>
//                                 <option value="">Select SSB</option>
//                                 {uniqueSSB.map((ssb, index) => (
//                                     <option key={index} value={ssb}>{ssb}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default Blocks;
import React from 'react';
import './componentscss/Blocks.css';

const Blocks = ({ selected, setSelected, setSelectedSidebarOption, role }) => {
    const handleOptionClick = (option) => {
        setSelected(option);  // Update the selected option
        setSelectedSidebarOption(option); // Update the sidebar based on the selected block
    };

    return (
        <div className="blocks-container">
            <div 
                className={`block-option ${selected === 'downloadcertificate' ? 'selected' : ''}`} 
                onClick={() => handleOptionClick('downloadcertificate')}
            >
                <h3>Download Certificate</h3>
            </div>
            {role === 'admin' && (
                <div 
                    className={`block-option ${selected === 'revokecertificates' ? 'selected' : ''}`} 
                    onClick={() => handleOptionClick('revokecertificates')}
                >
                    <h3>Revoke Certificate</h3>
                </div>
            )}
        </div>
    );
};

export default Blocks;


