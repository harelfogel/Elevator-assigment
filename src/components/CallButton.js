import React, { useContext, useState } from 'react';
import { ElevatorContext } from '../contexts/ElevatorContext';
import '../styles/styles.css';

export const CallButton = ({ floor }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const {callElevator}= useContext(ElevatorContext);


  const handleClick = () => {
    setIsWaiting(true);
    callElevator(floor);
  };

  return (
    <button
      className={`call-button ${isWaiting ? 'waiting' : ''}`}
      onClick={handleClick}
    >
      {isWaiting ? 'Waiting' : 'Call'}
    </button>
  );
};