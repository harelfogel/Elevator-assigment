import React, { useState } from 'react';
import { Floor } from './Floor';
import { FloorLabel } from './FloorLabel';
import { CallButton } from './CallButton';
import { buildingData } from '../data/buildingData';
import arrivalSound from '../assets/elevator_arrival_sound.mp3';
import '../styles/styles.css';

const arrivalAudio = new Audio(arrivalSound);

export const Building = () => {
  const { floors, elevators } = buildingData;

  const [buttonStates, setButtonStates] = useState(Array(floors.length).fill('idle'));
  const [elevatorPositions, setElevatorPositions] = useState(
    Array.from({ length: elevators }, () => 0)
  );
  const [elevatorRequests, setElevatorRequests] = useState([]);
  const [elevatorDestinations, setElevatorDestinations] = useState(Array.from({ length: elevators }, () => null));


  // const [elevatorLocations, setElevatorLocations] = useState(
  //   Array.from({ length: elevators }, () => 0)
  // );

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

  // Function to calculate the time taken
  const calculateTimeTaken = (startTime, endTime) => {
    return (endTime - startTime) / 1000;
  };

  const moveElevator = (elevator, targetFloor) => {
    const targetPosition = targetFloor;
  
    const startTime = performance.now();
  
    const intervalId = setInterval(() => {
      setElevatorPositions((prevPositions) => {
        const currentPosition = prevPositions[elevator];
  
        if (currentPosition !== elevatorDestinations[elevator]) {
          setElevatorDestinations((prevDestinations) => {
            const newDestinations = [...prevDestinations];
            newDestinations[elevator] = -1;
            return newDestinations;
          });

           // Update the button state to 'idle' when the elevator leaves the floor
        if (elevatorDestinations[elevator] !== null) {
          onButtonStateChange(elevatorDestinations[elevator], 'idle');
        }
        }
  
        if (currentPosition === targetPosition) {
          arrivalAudio.play();
  
          clearInterval(intervalId);
          const endTime = performance.now();
          const timeTaken = calculateTimeTaken(startTime, endTime);
          console.log(`Time taken for elevator ${elevator} to reach floor ${targetFloor}: ${timeTaken.toFixed(2)}s`);
  
          onButtonStateChange(targetFloor, 'arrived');
          
  
          setElevatorRequests((prevRequests) =>
            prevRequests.filter((request) => request.elevator !== elevator)
          );
  
          setElevatorDestinations((prevDestinations) => {
            const newDestinations = [...prevDestinations];
            newDestinations[elevator] = targetFloor;
            return newDestinations;
          });
  
          onButtonStateChange(targetFloor, 'arrived');
          return prevPositions;
        }
  
        const newPosition = currentPosition + (targetPosition > currentPosition ? 1 : -1);
        const newPositions = [...prevPositions];
        newPositions[elevator] = newPosition;
  
        // Change the button state back to 'call' when the elevator leaves the floor
        if (newPosition !== currentPosition) {
          onButtonStateChange( currentPosition, 'call');
        }
  
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
          <Floor
            key={floor}
            floor={floor}
            elevators={elevators}
            elevatorPositions={elevatorPositions}
            elevatorRequests={elevatorRequests}
            buttonStates={buttonStates}
          />
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
          <CallButton key={floor} floor={floor} onCallClick={callElevator} elevatorPositions={elevatorPositions} elevatorDestinations={elevatorDestinations}
            buttonState={buttonStates[floor]} onButtonStateChange={(newState) => onButtonStateChange(floor, newState)} />
        ))}
      </div>
    </div>
  );
};
