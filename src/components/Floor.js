import React from 'react';
import { Elevator } from './Elevator';
import { ElevatorIcon } from './ElevatorIcon';
import '../styles/styles.css';

export const Floor = ({ floor, elevators }) => {
  return (
    <div className="floor">
      {Array.from({ length: elevators }, (_, elevator) => (
        <Elevator key={elevator} elevator={elevator}>
          {floor === 9 && <ElevatorIcon />}
        </Elevator>
      ))}
    </div>
  );
};