import React, { createContext, useState } from 'react';


export const ElevatorContext = createContext();

export const ElevatorProvider = ({ children }) => {
    const [elevators, setElevators] = useState(
        Array.from({ length: 5 }, (_, i) => ({
            id: i,
            currentFloor: 0,
            isOccupied: false,
        }))
    );

    const callElevator = (floor) => {
        //find unoccupied elevators:
        const availableElevators = elevators.filter((elevator) => !elevator.isOccupied);

        if (availableElevators.length > 0) {
            const closetsElevator = availableElevators.reduce((prev, current) => {
                return Math.abs(current.currentFloor - floor) < Math.abs(prev.currentFloor - floor) ?
                    current : prev;
            });
            // Simulate sending the elevator to the called floor
            setTimeout(() => {
                setElevators((prevState) =>
                    prevState.map((elevator) =>
                        elevator.id === closetsElevator.id
                            ? { ...elevator, currentFloor: floor, isOccupied: true } :
                            elevator
                    )
                );
            }, 2000);

            // Simulate the elevator becoming unoccupied after reacing the called floor 
            setTimeout(() => {
                setElevators((prevState) =>
                    prevState.map((elevator) =>
                        elevator.id === closetsElevator.id
                            ? { ...elevator, isOccupied: false }
                            : elevator
                    )
                );
            },4000);

        } else {
            //retry calling an elevator after a delay
            setTimeout(()=>{
                callElevator(floor)
            },2000);
        }

    };

    return (
        <ElevatorContext.Provider value={{ elevators, callElevator }}>
            {children}
        </ElevatorContext.Provider>
    );

};