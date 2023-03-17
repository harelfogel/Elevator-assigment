// Elevator.js

import React from 'react';
import '../styles/styles.css';

export const Elevator = ({ children }) => {
  return <div className="elevator" style={{ position: 'relative' }}>{children}</div>;
};
