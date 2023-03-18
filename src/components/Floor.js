// Floor.js

import React, { useEffect } from 'react';
import { Elevator } from './Elevator';
import { ElevatorIcon } from './ElevatorIcon';
import '../styles/styles.css';
import { formatTime } from '../utils/utils'; 
import { buildingData } from '../data/buildingData';

const { lastIndex  } = buildingData;
export const Floor = ({
  floor,
  elevators,
  elevatorPositions,
  elevatorRequests,
  buttonStates,
  elevatorTimeTaken,
  timeTaken,
  elevatorDestinations,

}) => {

  useEffect(() => {
    console.log({floor});
    //console.log('timeTaken prop updated:', timeTaken);
    console.log('elevatorTimeTaken Index updated:', elevatorTimeTaken[9-3]);
    console.log('elevatorTimeTaken prop updated:', elevatorTimeTaken);
    console.log('elevator postions prop updated:', elevatorPositions)

  }, [timeTaken,elevatorTimeTaken]);

  const isElevatorOccupied = (elevator) => {
    return elevatorRequests.some((req) => req.elevator === elevator);
  };

  const isDestinationFloor = (elevator) => {
    const request = elevatorRequests.find((req) => req.elevator === elevator);
    console.log(request);
    return request && lastIndex - floor === request.floor;
  };
  return (
    <div className="floor">
      {Array.from({ length: elevators }, (_, elevator) => (
        <Elevator key={elevator} elevator={elevator}>
          {lastIndex - floor === elevatorPositions[elevator] && (
            <ElevatorIcon
              isOccupied={isElevatorOccupied(elevator)}
              buttonStates={buttonStates}
              currentFloor={lastIndex - floor}
            />
          )}
          {lastIndex - floor === elevatorPositions[elevator] && elevatorDestinations[elevator] === (lastIndex - floor) && (
             <div className="elapsed-time">
             {formatTime(elevatorTimeTaken[floor])}
           </div>
          )}
        </Elevator>
      ))}
    </div>
  );
};
