import React, { useState } from 'react';
import { Floor } from './Floor';
import { FloorLabel } from './FloorLabel';
import { CallButton } from './CallButton';
import { buildingData } from '../data/buildingData';
import arrivalSound from '../assets/elevator_arrival_sound.mp3';
import '../styles/styles.css';

const arrivalAudio = new Audio(arrivalSound);

export const Building = () => {
  const { floors, elevators, lastIndex } = buildingData;
  const [buttonStates, setButtonStates] = useState(Array(floors.length).fill('idle'));
  const [unassignedCalls, setUnassignedCalls] = useState([]);
  const [elevatorData, setElevatorData] = useState(
    Array.from({ length: elevators }, () => ({
      position: 0,
      requests: [],
      destination: null,
      timeTaken: Array(floors.length).fill(null),
    }))
  );


  const findClosestAvailableElevator = (floor) => {
    let minDistance = Infinity;
    let closestElevator = null;

    elevatorData.forEach((elevator, index) => {
      const distance = Math.abs(floor - elevator.position);

      const isOccupiedAndMovingUp = elevator.requests.some(
        (req) => req.floor > elevator.position
      );

      if (
        distance < minDistance &&
        (!elevator.requests.length || isOccupiedAndMovingUp)
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

  const moveElevatorSmoothly = (elevatorIndex, targetFloor, stepDuration) => {
    const currentPosition = elevatorData[elevatorIndex].position;
    const newPosition = currentPosition + (targetFloor > currentPosition ? 1 : -1);

    if (currentPosition === targetFloor) {
      return;
    } else {
      setElevatorData((prevData) => {
        const newData = [...prevData];
        newData[elevatorIndex].position = newPosition;
        return newData;
      });
    }

    setTimeout(() => {
      moveElevatorSmoothly(elevatorIndex, targetFloor, stepDuration);
    }, stepDuration);
  };


  const moveElevator = (elevatorIndex, targetFloor) => {
    const startTime = performance.now();

    setElevatorData((prevData) => {
      const newData = [...prevData];
      newData[elevatorIndex].state = 'moving';
      return newData;
    });

    const stepDuration = 1000;

    setTimeout(() => {
      moveElevatorSmoothly(elevatorIndex, targetFloor, stepDuration);
    }, stepDuration);

    setTimeout(() => {
      arrivalAudio.play();
      const endTime = performance.now();
      const timeTaken = calculateTimeTaken(startTime, endTime);

      console.log(
        `Time taken for elevator ${elevatorIndex} to reach floor ${targetFloor}: ${timeTaken.toFixed(
          2
        )}s`
      );

      onButtonStateChange(targetFloor, 'arrived');
      setElevatorData((prevData) => {
        const newData = [...prevData];
        newData[elevatorIndex].timeTaken[targetFloor] = timeTaken.toFixed(2);
        newData[elevatorIndex].requests = newData[elevatorIndex].requests.filter(
          (request) => request.elevator !== elevatorIndex
        );
        newData[elevatorIndex].destination = targetFloor;
        newData[elevatorIndex].state = 'idle';
        return newData;
      });


      setTimeout(() => {
        setElevatorData((prevData) => {
          const newData = [...prevData];
          newData[elevatorIndex].state = 'idle';
          setElevatorData(newData);

          onButtonStateChange(targetFloor, 'idle');

          setTimeout(() => {
            const newRequest = newData[elevatorIndex].requests.find(
              (request) => request.elevator === elevatorIndex
            );
            if (newRequest) {
              moveElevator(elevatorIndex, newRequest.floor);
            }
          }, 2000);
          return newData;
        });
      }, 2000);
    }, Math.abs(targetFloor - elevatorData[elevatorIndex].position) * stepDuration + stepDuration);
  };





  const callElevator = (floor) => {
    const availableElevatorIndex = findClosestAvailableElevator(floor);

    if (availableElevatorIndex !== null) {
      setElevatorData((prevData) => {
        const newData = [...prevData];
        newData[availableElevatorIndex].requests.push({ elevator: availableElevatorIndex, floor });
        return newData;
      });
      moveElevator(availableElevatorIndex, floor);
    } else {
      const nextRequest = unassignedCalls.length === 0 ? null : unassignedCalls.shift();
      if (nextRequest !== null) {
        const nextElevatorIndex = findClosestAvailableElevator(nextRequest);
        if (nextElevatorIndex !== null) {
          setElevatorData((prevData) => {
            const newData = [...prevData];
            newData[nextElevatorIndex].requests.push({ elevator: nextElevatorIndex, floor: nextRequest });
            return newData;
          });
          moveElevator(nextElevatorIndex, nextRequest);
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
            elevatorData={elevatorData}
            buttonStates={buttonStates}
            elevatorIndex={elevatorData.findIndex(
              (elevator) => lastIndex - floor === elevator.position
            )}
          />
        ))}
      </div>
      <div className="call-buttons">
        {floors.map((_, floor) => (
          <CallButton
            key={floor}
            floor={floor}
            onCallClick={callElevator}
            elevatorData={elevatorData}
          />
        ))}
      </div>
    </div>
  );
};
