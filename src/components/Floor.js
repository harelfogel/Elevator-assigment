// Floor.js

import React from 'react';
import { Elevator } from './Elevator';
import { ElevatorIcon } from './ElevatorIcon';
import '../styles/styles.css';

export const Floor = ({
  floor,
  elevators,
  elevatorPositions,
  elevatorRequests,
  buttonStates,
  elevatorTimeTaken,
}) => {
  const isElevatorOccupied = (elevator) => {
    return elevatorRequests.some((req) => req.elevator === elevator);
  };

  const isDestinationFloor = (elevator) => {
    const request = elevatorRequests.find((req) => req.elevator === elevator);
    return request && 9 - floor === request.floor;
  };
  return (
    <div className="floor">
      {Array.from({ length: elevators }, (_, elevator) => (
        <Elevator key={elevator} elevator={elevator}>
          {9 - floor === elevatorPositions[elevator] && (
            <ElevatorIcon
              isOccupied={isElevatorOccupied(elevator)}
              buttonStates={buttonStates}
              currentFloor={9 - floor}
            />
          )}
          {isDestinationFloor(elevator) && (
            <div className="elapsed-time">{elevatorTimeTaken[elevator]}sec</div>
          )}
        </Elevator>
      ))}
    </div>
  );
};
