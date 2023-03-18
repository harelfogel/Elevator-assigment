// Floor.js

import React, { useEffect } from 'react';
import { Elevator } from './Elevator';
import { ElevatorIcon } from './ElevatorIcon';
import '../styles/styles.css';
import { formatTime } from '../utils/utils';
import { buildingData } from '../data/buildingData';


const { lastIndex } = buildingData;
export const Floor = ({ floor, elevators, elevatorData, buttonStates, elevatorIndex }) => {
  useEffect(() => {
    // console.log({ floor });
    // console.log('elevatorData prop updated:', elevatorData[floor]);
    // console.log(elevators);
  }, [elevatorData, floor, elevators]);

  const isElevatorOccupied = (elevator) => {
    return elevatorData[elevator].requests.length > 0;
  };

  const isDestinationFloor = (elevator) => {
    const request = elevatorData[elevator].requests.find(
      (req) => lastIndex - floor === req.floor
    );

    //console.log(request);
    const isDestination = request !== undefined;
    // console.log(
    //   `Elevator: ${elevator}, Floor: ${floor}, isDestination: ${isDestination}`
    // );
    //console.log(isDestination)
    return isDestination;
  };

  const timeTakenOnDestinationFloor = () => {
    const timeTaken =
      elevatorIndex >= 0
        ? elevatorData[elevatorIndex].timeTaken[lastIndex - floor]
        : null;
    return timeTaken;
  };



  return (
    <div className="floor">
      {Array.from({ length: elevators }, (_, elevator) => (
        <Elevator key={elevator} elevator={elevator}>
          {lastIndex - floor === elevatorData[elevator].position && (
            <ElevatorIcon
              isOccupied={isElevatorOccupied(elevator)}
              isArrived={isDestinationFloor(elevator)}
              currentFloor={lastIndex - floor}
              buttonStates={buttonStates}
            />
          )}
          {lastIndex - floor === elevatorData[elevator].position &&
            timeTakenOnDestinationFloor() && (
              <div className="elapsed-time">{formatTime(timeTakenOnDestinationFloor())}</div>
            )}
        </Elevator>
      ))}
    </div>
  );
};
