// CallButton.js
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';

export const CallButton = ({ floor, onCallClick }) => {
  const [buttonState, setButtonState] = useState('idle');

  const handleClick = () => {
    if (buttonState === 'idle') {
      setButtonState('waiting');
      onCallClick(floor, () => setButtonState('arrived'));
    }
  };

  useEffect(() => {
    if (buttonState === 'arrived') {
      setTimeout(() => setButtonState('idle'), 3000);
    }
  }, [buttonState]);

  const buttonLabel = buttonState === 'idle' ? 'Call' : buttonState === 'waiting' ? 'Waiting' : 'Arrived';
  const buttonClass = `call-button ${buttonState}`;

  return (
    <button onClick={handleClick} className={buttonClass}>
      {buttonLabel}
    </button>
  );
};
