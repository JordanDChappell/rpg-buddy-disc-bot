const cubeDimension = 20;
const numberOfRooms = Math.pow(cubeDimension, 3);

let theCube;
let currentRoom;
let gameInterval;
let gameTimer;

const beginGameLoop = (channel) => {
  gameInterval = setInterval(() => {
    gameTimer = setTimeout(() => {
      channel.send('You hear a noise, it begins as a soft pulsating tone... and eventually builds to shrill piercing alarm.');
    }, 1000 * 60 * 9);
  }, 1000 * 60 * 10);
};

const initRoomNumbers = () => {
  const roomNumbers = [];

  for (let i = 1; i < numberOfRooms + 1; i++) {
    roomNumbers.push(i);
  }

  return roomNumbers;
};

export const pauseCubeGame = () => {
  clearInterval(gameInterval);
  clearTimeout(gameTimer);
};

export const unpauseCubeGame = (channel) => {
  beginGameLoop(channel);
};

export const getCurrentRoom = () => currentRoom;

export const shuffleCube = () => {
  // shuffle only rooms that don't appear along an edge
  // this case is any start or end index for x, y, z

  for (let x = 0; x < cubeDimension; x++) {
    for (let y = 0; y < cubeDimension; y++) {
      for (let z = 0; z < cubeDimension; z++) {
        if (
          x === 0 ||
          x === cubeDimension - 1 ||
          y === 0 ||
          y === cubeDimension - 1 ||
          z === 0 ||
          z === cubeDimension - 1
        ) continue;

        const swapDimX = Math.floor(Math.random() * cubeDimension);
        const swapDimY = Math.floor(Math.random() * cubeDimension);
        const swapDimZ = Math.floor(Math.random() * cubeDimension);

        let temp = theCube[swapDimX][swapDimY][swapDimZ];

        theCube[swapDimX][swapDimY][swapDimZ] = theCube[x][y][z];
        theCube[x][y][z] = temp;
      }
    }
  }
};

export const findCurrentRoomPosition = () => {
  for (let x = 0; x < cubeDimension; x++) {
    for (let y = 0; y < cubeDimension; y++) {
      for (let z = 0; z < cubeDimension; z++) {
        if (theCube[x][y][z] === currentRoom) return { x, y, z };
      }
    }
  }
};

export const getCurrentSurroundingRooms = () => {
  // we can see rooms at x +- 1, y +- 1, z +- 1 exclusively
  const { x, y, z } = findCurrentRoomPosition();
  return {
    north: theCube[x][y + 1][z],
    south: theCube[x][y - 1][z],
    east: theCube[x + 1][y][z],
    west: theCube[x - 1][y][z],
    up: theCube[x][y][z + 1],
    down: theCube[x][y][z + 1],
  };
};

export const moveToRoom = (roomNumber) => {
  // we should ensure that the room number is in the surrounding rooms
  const surroundingRooms = getCurrentSurroundingRooms();
  Object.keys(surroundingRooms).forEach(key => {
    if (surroundingRooms[key] === roomNumber)
      currentRoom = roomNumber;
  });
}

export const initCubeGame = (channel) => {
  // filling out the cube grid with 0's
  theCube = Array(cubeDimension)
    .fill(0)
    .map(() => 
      Array(cubeDimension)
      .fill(0)
      .map(() => 
        Array(cubeDimension)
        .fill(0)
      )
    );

  // adding room numbers to the cube in sequence
  let roomNumbersIndex = 0;
  const roomNumbersList = initRoomNumbers();
  for (let x = 0; x < cubeDimension; x++) {
    for (let y = 0; y < cubeDimension; y++) {
      for (let z = 0; z < cubeDimension; z++) {
        theCube[x][y][z] = roomNumbersList[roomNumbersIndex++];
      }
    }
  }

  // shuffle the cube, determine the starting room, begin the game...
  shuffleCube();
  currentRoom = theCube[cubeDimension / 2][cubeDimension / 2][cubeDimension / 2];
  beginGameLoop(channel);
};
