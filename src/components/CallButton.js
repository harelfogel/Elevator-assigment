import React from 'react';
import '../styles/styles.css';

export const CallButton = ({ floor }) => {
  const handleClick = () => {
    // Implement your logic for handling button clicks here
    console.log(`Call elevator to floor ${floor + 1}`);
  };

  return (
    <button onClick={handleClick} className="call-button">
      Call
    </button>
  );
};