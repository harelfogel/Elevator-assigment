export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return minutes > 0 ? `${minutes}min ${seconds.toFixed(2)} sec` : `${seconds.toFixed(2)} sec`;
};


export const generateFloorLabels = (numFloors) => {
  const floorLabels = ['Ground Floor'];
  for (let i = 1; i < numFloors; i++) {
    floorLabels.push(`${i}${i % 10 === 1 ? 'st' : i % 10 === 2 ? 'nd' : i % 10 === 3 ? 'rd' : 'th'}`);
  }
  return floorLabels;
};

