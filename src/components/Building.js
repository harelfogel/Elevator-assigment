import React, { useState } from 'react';
import { Floor } from './Floor';
import { FloorLabel } from './FloorLabel';
import { CallButton } from './CallButton';
import { buildingData } from '../data/buildingData';
import '../styles/styles.css';

export const Building = () => {
  const { floors, elevators } = buildingData;

  const [buttonStates, setButtonStates] = useState(Array(floors.length).fill('idle'));
  const [elevatorPositions, setElevatorPositions] = useState(
    Array.from({ length: elevators }, () => 0)
  );
  const [elevatorRequests, setElevatorRequests] = useState([]);

  const [elevatorLocations, setElevatorLocations] = useState(
    Array.from({ length: elevators }, () => 0)
  );

  const findClosestAvailableElevator = (floor) => {
    let minDistance = Infinity;
    let closestElevator = null;

    elevatorPositions.forEach((elevatorPosition, index) => {
      const distance = Math.abs(floor - elevatorPosition);
      if (distance < minDistance && !elevatorRequests.some((req) => req.elevator === index)) {
        minDistance = distance;
        closestElevator = index;
      }
    });
    console.log(`The closest elevator is: ${closestElevator}`);
    return closestElevator;
  };

  const moveElevator = (elevator, targetFloor) => {
    const targetPosition =  targetFloor;
  
    const intervalId = setInterval(() => {
      setElevatorPositions((prevPositions) => {
        const currentPosition = prevPositions[elevator];
  
        if (currentPosition === targetPosition) {
          clearInterval(intervalId);
          return prevPositions;
        }
  
        const newPosition = currentPosition + (targetPosition > currentPosition ? 1 : -1);
        const newPositions = [...prevPositions];
        newPositions[elevator] = newPosition;
        console.log(`The new Positions array is ${newPositions}`);
  
        return newPositions;
      });
    }, 1000);
  };
  

  const callElevator = (floor) => {
    const availableElevator = findClosestAvailableElevator(floor);

    if (availableElevator !== null) {
      setElevatorRequests((prevRequests) => [...prevRequests, { elevator: availableElevator, floor }]);
      moveElevator(availableElevator, floor);
    }
  };

  const onButtonStateChange = (floor, newState) => {
    setButtonStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[floor] = newState;
      return newStates;
    });
  };

  return (
    <div className="building-wrapper">
      <div className="floor-labels">
        {floors.map((floorName, index) => (
          <FloorLabel key={index} floorName={floorName} />
        ))}
      </div>
      <div className="building">
        {floors.map((_, floor) => (
          <Floor key={floor} floor={floor} elevators={elevators} elevatorPositions={elevatorPositions} />
        ))}
      </div>
      {/* <div className="call-buttons">
        {floors.map((_, floor) => (
          <CallButton
            key={floor}
            floor={floor}
            buttonState={buttonStates[floor]}
            callElevator={callElevator}
            onButtonStateChange={(newState) => onButtonStateChange(floor, newState)}
          />
        ))}
      </div> */}
      <div className="call-buttons">
        {floors.map((_, floor) => (
          <CallButton key={floor} floor={floor} onCallClick={callElevator} buttonState={buttonStates[floor]} onButtonStateChange={(newState) => onButtonStateChange(floor, newState)} />
        ))}
      </div>
    </div>
  );
};
