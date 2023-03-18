import { generateFloorLabels } from "../utils/utils";
const numberOfFloors = 10;  //Custom number of Floors
const numberOfElevators = 5; // Custom numebr of Elevators

export const buildingData = {
  floors: generateFloorLabels(numberOfFloors),
  elevators: numberOfElevators,
};

buildingData.lastIndex = buildingData.floors.length - 1;
