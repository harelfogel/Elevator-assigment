import React, { useState } from 'react';
import { Floor } from './Floor';
import { FloorLabel } from './FloorLabel';
import { CallButton } from './CallButton';
import { buildingData } from '../data/buildingData';
import '../styles/styles.css';

export const Building = () => {
  const { floors, elevators } = buildingData;
  const initialElevatorState = Array(elevators).fill({ currentFloor: 0, status: 'idle' });
  const [elevatorState, setElevatorState] = useState(initialElevatorState);
  const [requestQueue, setRequestQueue] = useState([]);


  const handleElevatorCall = (requestedFloor) => {
    console.log(`Elevator requested at floor ${requestedFloor + 1}`);

    const closestElevator = findClosestElevator(requestedFloor);
    if (closestElevator != null) {
      console.log(`Elevator ${closestElevator + 1} is moving to floor ${requestedFloor + 1}`);
      moveElevator(closestElevator, requestedFloor);
    } else {
      console.log('No availble elevators at this time');
      // Find the closest elevator and send it to the requested floor
      // Add the request to the queue
      setRequestQueue((prevQueue) =>[...prevQueue,requestedFloor])
    }
  };

  const findClosestElevator = (requestedFloor) => {
    let closestElevator = null;
    let minDistance = Infinity;

    elevatorState.forEach((elevator, index) => {
      const { currentFloor, status } = elevator;

      if (status === 'idle' || (status === 'moving' && currentFloor <= requestedFloor)) {
        const distance = Math.abs(requestedFloor - currentFloor);

        if (distance < minDistance) {
          closestElevator = index;
          minDistance = distance;
        }
      }

    });
    return closestElevator;
  };

  const moveElevator = (elevatorIndex, targetFloor) => {
    const newState = [...elevatorState];
    newState[elevatorIndex] = { currentFloor: targetFloor, status: 'idle' };
    setElevatorState(newState);
    console.log(`Elevator ${elevatorIndex + 1} moved to floor ${targetFloor + 1}`);
  
    // Schedule to check the queue after a delay
    setTimeout(() => {
      // Check if there are pending requests in the queue
      if (requestQueue.length > 0) {
        // Get the next request from the queue
        const nextRequest = requestQueue[0];
  
        // Remove the processed request from the queue
        const updatedQueue = requestQueue.slice(1);
        setRequestQueue(updatedQueue);
  
        // Move the elevator to the next request
        moveElevator(elevatorIndex, nextRequest);
      }
    }, 1000); // Adjust the delay as needed
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
          <Floor key={floor} floor={floor} elevators={elevators} />
        ))}
      </div>
      <div className="call-buttons">
        {floors.map((_, floor) => (
          <CallButton key={floor} floor={floor} onElevatorCall={handleElevatorCall} />
        ))}
      </div>
    </div>
  );
};