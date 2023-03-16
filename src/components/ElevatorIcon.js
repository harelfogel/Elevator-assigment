// ElevatorIcon.js
import React from 'react';
import { elevatorIconString } from '../assets/icons8-elevator-string';
import '../styles/styles.css';

export const ElevatorIcon = ({ isOccupied }) => {
  const className = isOccupied ? 'elevator-icon occupied' : 'elevator-icon';

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: elevatorIconString }}
    />
  );
};
