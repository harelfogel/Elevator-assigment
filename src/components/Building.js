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

  // Record the start time
  const startTime = performance.now();

  const intervalId = setInterval(() => {
    setElevatorPositions((prevPositions) => {
      const currentPosition = prevPositions[elevator];

      // Check if the elevator is leaving its previously set destination floor
      if (currentPosition !== elevatorDestinations[elevator]) {
        // Update elevatorDestinations when the elevator leaves the floor
        setElevatorDestinations((prevDestinations) => {
          const newDestinations = [...prevDestinations];
          newDestinations[elevator] = -1;
          return newDestinations;
        });
      }

      if (currentPosition === targetPosition) {
        // Play the arrival sound
        arrivalAudio.play();

        clearInterval(intervalId);
        // Record the end time
        const endTime = performance.now();
        // Calculate the time it took for the elevator to reach the destination
        const timeTaken = calculateTimeTaken(startTime, endTime);
        console.log(`Time taken for elevator ${elevator} to reach floor ${targetFloor}: ${timeTaken.toFixed(2)}s`);
        // Remove the elevator request when it reaches the target floor
        setElevatorRequests((prevRequests) =>
          prevRequests.filter((request) => request.elevator !== elevator)
        );

        // Update elevatorDestinations when the elevator reaches the target floor
        setElevatorDestinations((prevDestinations) => {
          const newDestinations = [...prevDestinations];
          newDestinations[elevator] = targetFloor;
          return newDestinations;
        });

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
          <Floor
            key={floor}
            floor={floor}
            elevators={elevators}
            elevatorPositions={elevatorPositions}
            elevatorRequests={elevatorRequests}
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
