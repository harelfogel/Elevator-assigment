// ElevatorIcon.js
import React from 'react';
import { elevatorIconString } from '../assets/icons8-elevator-string';
import '../styles/styles.css';

export const ElevatorIcon = ({ isOccupied, buttonStates, currentFloor }) => {
  let className = 'elevator-icon';
  const isArrived = buttonStates[currentFloor] === 'arrived';

  if (isOccupied) {
    className += ' occupied';
  } else if (isArrived) {
    className += ' arrived';
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: elevatorIconString }}
    />
  );
};
