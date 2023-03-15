import React, { useState } from 'react';
import '../styles/styles.css';

export const CallButton = ({ floor,onElevatorCall  }) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const handleClick = () => {
    setIsWaiting(true);
    onElevatorCall(floor);
    console.log(`Call elevator to floor ${floor + 1}`);
  };

  const buttonClass = isWaiting ? 'call-button waiting' : 'call-button';

  return (
    <button onClick={handleClick} className={buttonClass}>
      {isWaiting ? 'Waiting' : 'Call'}
    </button>
  );
};
