// Floor.js
import React from 'react';
import { Elevator } from './Elevator';
import { ElevatorIcon } from './ElevatorIcon';
import '../styles/styles.css';

export const Floor = ({ floor, elevators, elevatorPositions }) => {
  return (
    <div className="floor">
      {Array.from({ length: elevators }, (_, elevator) => (
        <Elevator key={elevator} elevator={elevator}>
          {9 - floor === elevatorPositions[elevator] && <ElevatorIcon />}
        </Elevator>
      ))}
    </div>
  );
};
