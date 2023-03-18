export const formatTime = (time) => {
  if (time === null || time === undefined) {
  }
  return `${time}sec`;
};

export const generateFloorLabels = (numFloors) => {
  const floorLabels = ['Ground Floor'];
  for (let i = 1; i < numFloors; i++) {
    floorLabels.push(`${i}${i % 10 === 1 ? 'st' : i % 10 === 2 ? 'nd' : i % 10 === 3 ? 'rd' : 'th'}`);
  }
  return floorLabels;
};

