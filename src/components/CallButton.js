// CallButton.js
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';

export const CallButton = ({ floor, onCallClick, elevatorPositions,elevatorDestinations }) => {
  const [buttonState, setButtonState] = useState('idle');

  useEffect(() => {
    if (elevatorDestinations.some((destination) => destination === floor)) {
      setButtonState('arrived');
    }
  }, [elevatorDestinations, floor]);

  const handleClick = () => {
    if (buttonState === 'idle') {
      setButtonState('waiting');
      onCallClick(floor);
    }
  };

  let buttonClass = 'call-button';
  let buttonText = 'Call';

  if (buttonState === 'waiting') {
    buttonClass = 'call-button waiting';
    buttonText = 'Waiting';
  } else if (buttonState === 'arrived') {
    buttonClass = 'call-button arrived';
    buttonText = 'Arrived';
  }

  return (
    <button onClick={handleClick} className={buttonClass}>
      {buttonText}
    </button>
  );
};
