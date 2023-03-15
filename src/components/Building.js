import React from 'react';
import { Floor } from './Floor';
import { FloorLabel } from './FloorLabel';
import { CallButton } from './CallButton';
import { buildingData } from '../data/buildingData';
import '../styles/styles.css';

export const Building = () => {
  const { floors, elevators } = buildingData;

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
          <CallButton key={floor} floor={floor} />
        ))}
      </div>
    </div>
  );
};