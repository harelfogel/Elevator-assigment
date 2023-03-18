// CallButton.js
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';

export const CallButton = ({ floor, onCallClick, elevatorData }) => {
  const [buttonState, setButtonState] = useState('idle');

  const elevatorPositions = elevatorData.map((elevator) => elevator.position);
  const elevatorDestinations = elevatorData.map((elevator) => elevator.destination);

  useEffect(() => {
    const isElevatorArrived = elevatorDestinations.some((destination) => destination === floor);
    const isElevatorLeaving = elevatorPositions.every((position) => position !== floor);

    if (isElevatorArrived) {
      setButtonState('arrived');
    } else if (isElevatorLeaving && buttonState === 'arrived') {
      setButtonState('idle');
    }
  }, [elevatorDestinations, elevatorPositions, floor, buttonState]);

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
