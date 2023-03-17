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
  const [elevatorRequests, setElevatorRequests] = useState(Array.from({ length: elevators }, () => []));
  const [elevatorDestinations, setElevatorDestinations] = useState(Array.from({ length: elevators }, () => null));
  const [unassignedCalls, setUnassignedCalls] = useState([]);
  const [elevatorTimeTaken, setElevatorTimeTaken] = useState(Array.from({ length: elevators }, () => 0));
  const [elevatorStates, setElevatorStates] = useState(Array.from({ length: elevators }, () => 'idle')); // New state for elevator states





  const findClosestAvailableElevator = (floor) => {
    let minDistance = Infinity;
    let closestElevator = null;

    elevatorPositions.forEach((elevatorPosition, index) => {
      const distance = Math.abs(floor - elevatorPosition);

      // Check if the elevator is occupied and moving in the right direction
      const isOccupiedAndMovingUp = elevatorRequests.some(
        (req) => req.elevator === index && req.floor > elevatorPosition
      );

      if (
        distance < minDistance &&
        (!elevatorRequests.some((req) => req.elevator === index) || isOccupiedAndMovingUp)
      ) {
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

    setElevatorStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[elevator] = 'moving';
      return newStates;
    });

    const intervalId = setInterval(() => {
      setElevatorPositions((prevPositions) => {
        const currentPosition = prevPositions[elevator];

        if (currentPosition === targetPosition) {
          arrivalAudio.play();

          clearInterval(intervalId);
          const endTime = performance.now();
          const estimatedTime = Math.abs(targetFloor - elevatorPositions[elevator]) * 1000;


          const timeTaken = calculateTimeTaken(startTime, endTime);
          setElevatorTimeTaken((prevTimeTaken) => {
            const newTimeTaken = [...prevTimeTaken];
            newTimeTaken[elevator] = timeTaken.toFixed(2);
            return newTimeTaken;
          });
          console.log(
            `Time taken for elevator ${elevator} to reach floor ${targetFloor}: ${timeTaken.toFixed(
              2
            )}s`
          );

          onButtonStateChange(targetFloor, 'arrived');

          setElevatorRequests((prevRequests) =>
            prevRequests.filter((request) => request.elevator !== elevator)
          );

          setElevatorDestinations((prevDestinations) => {
            const newDestinations = [...prevDestinations];
            newDestinations[elevator] = targetFloor;
            return newDestinations;
          });

          // Add a delay of 2 seconds before changing the button state to 'idle'
          setTimeout(() => {
            onButtonStateChange(targetFloor, 'idle');
            setElevatorStates((prevStates) => {
              const newStates = [...prevStates];
              newStates[elevator] = 'idle';
              return newStates;
            });
          }, 2000);

          // Process the next request if available
          setTimeout(() => {
            const nextRequest = elevatorRequests.find(
              (request) => request.elevator === elevator
            );
            if (nextRequest) {
              moveElevator(elevator, nextRequest.floor);
            }
          }, 2000);

          return prevPositions;
        }

        const newPosition =
          currentPosition + (targetPosition > currentPosition ? 1 : -1);
        const newPositions = [...prevPositions];
        newPositions[elevator] = newPosition;

        return newPositions;
      });
    }, 1000);
  };


  const callElevator = (floor) => {
    const availableElevator = findClosestAvailableElevator(floor);

    if (availableElevator !== null) {
      setElevatorRequests((prevRequests) => [...prevRequests, { elevator: availableElevator, floor }]);
      moveElevator(availableElevator, floor);
    } else {
      const nextRequest = unassignedCalls.length === 0 ? null : unassignedCalls.shift();
      if (nextRequest !== null) {
        const nextElevator = findClosestAvailableElevator(nextRequest);
        if (nextElevator !== null) {
          setElevatorRequests((prevRequests) => [...prevRequests, { elevator: nextElevator, floor: nextRequest }]);
          moveElevator(nextElevator, nextRequest);
        } else {
          setUnassignedCalls((prevUnassignedCalls) => [...prevUnassignedCalls, floor]);
        }
      } else {
        setUnassignedCalls((prevUnassignedCalls) => [...prevUnassignedCalls, floor]);
      }
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
            elevatorTimeTaken={elevatorTimeTaken}


          />
        ))}
      </div>
      <div className="call-buttons">
        {floors.map((_, floor) => (
          <CallButton key={floor} floor={floor} onCallClick={callElevator} elevatorPositions={elevatorPositions} elevatorDestinations={elevatorDestinations}
            buttonState={buttonStates[floor]} onButtonStateChange={(newState) => onButtonStateChange(floor, newState)} />
        ))}
      </div>
    </div>
  );
};
