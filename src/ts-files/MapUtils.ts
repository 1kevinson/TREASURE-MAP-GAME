// @ts-nocheck
import {
  Direction,
  EmptyGrid,
  Grid,
  GridPosition,
  Mountain,
  Orientation,
  Adventurer,
  Treasure,
} from "./Classes";

const createMap = (rows: number, columns: number) => {
  return new Array(rows)
    .fill(null)
    .map((row) => new Array(columns).fill([new EmptyGrid("-")]));
};

const initializeMap = (content: string): [Grid[][][], Adventurer] => {
  let map = [];
  let adventurer = null;

  const array = content.split("\n");
  for (const line of array) {
    if (line.indexOf("#") === 0) {
      continue;
    }

    const lineArray = line.split("-");

    if (line[0].indexOf("C") === 0) {
      map = createMap(+lineArray[2], +lineArray[1]);
    }
    if (line[0].indexOf("M") === 0) {
      map[+lineArray[2]][+lineArray[1]] = [new Mountain("M")];
    }
    if (line[0].indexOf("T") === 0) {
      map[+lineArray[2]][+lineArray[1]] = [
        new Treasure(`T(${lineArray[3].trim()})`, +lineArray[3]),
      ];
    }
    if (line[0].indexOf("A") === 0) {
      adventurer = new Adventurer(
        `A(${lineArray[1].trim()})`,
        lineArray[1].trim(),
        { x: +lineArray[3], y: +lineArray[2] },
        lineArray[4].trim() as Orientation
      );
      map[+lineArray[3]][+lineArray[2]] = [adventurer];
    }
  }

  return [map, adventurer];
};

const renderMap = (mapData: Grid[][][]) => {
  const rowCards = document.querySelector(".row-cards");

  rowCards.innerHTML = "";

  for (let i = 0; i < mapData.length; i++) {
    for (let j = 0; j < mapData[i].length; j++) {
      let index = mapData[i][j].length === 1 ? 0 : 1;
      if (mapData[i][j][index] instanceof EmptyGrid) {
        const e = document.createElement("div");
        e.classList.add("card-box");
        rowCards.appendChild(e);
      }

      if (mapData[i][j][index] instanceof Mountain) {
        const cardText = document.createElement("div");

        cardText.innerText = "M";
        cardText.classList.add("card-text", "mountain");
        rowCards.appendChild(cardText);
      }

      if (mapData[i][j][index] instanceof Treasure) {
        const cardText = document.createElement("div");

        cardText.innerText = (mapData[i][j][index] as Treasure).getValue();
        cardText.classList.add("card-text", "treasure");
        rowCards.appendChild(cardText);
      }

      if (mapData[i][j][index] instanceof Adventurer) {
        const cardText = document.createElement("div");

        cardText.innerText = mapData[i][j][index].value;
        cardText.classList.add("card-text", "adventurer");
        rowCards.appendChild(cardText);
      }
    }
  }
};

const moveAdventurer = (
  orientation: Orientation,
  position: GridPosition
): GridPosition => {
  switch (orientation) {
    case Orientation.NORTH:
      return { x: position.x - 1, y: position.y };
    case Orientation.SOUTH:
      return { x: position.x + 1, y: position.y };
    case Orientation.WEST:
      return { x: position.x, y: position.y - 1 };
    case Orientation.EAST:
      return { x: position.x, y: position.y + 1 };
    default:
      return position;
  }
};

const changeOrientation = (
  currentOrientation: Orientation,
  direction: Direction
): Orientation => {
  if (
    currentOrientation === Orientation.SOUTH &&
    direction === Direction.RIGHT
  ) {
    return Orientation.EAST;
  }
  if (
    currentOrientation === Orientation.SOUTH &&
    direction === Direction.LEFT
  ) {
    return Orientation.WEST;
  }
  if (
    currentOrientation === Orientation.WEST &&
    direction === Direction.RIGHT
  ) {
    return Orientation.SOUTH;
  }
  if (currentOrientation === Orientation.WEST && direction === Direction.LEFT) {
    return Orientation.NORTH;
  }
  if (
    currentOrientation === Orientation.NORTH &&
    direction === Direction.RIGHT
  ) {
    return Orientation.EAST;
  }
  if (
    currentOrientation === Orientation.NORTH &&
    direction === Direction.LEFT
  ) {
    return Orientation.WEST;
  }
  if (
    currentOrientation === Orientation.EAST &&
    direction === Direction.RIGHT
  ) {
    return Orientation.SOUTH;
  }
  if (currentOrientation === Orientation.EAST && direction === Direction.LEFT) {
    return Orientation.NORTH;
  }

  return currentOrientation;
};

const getMapResult = (mapData: Grid[][][]) => {
  const grids = {
    mountain: [],
    treasure: [],
    adventurer: [],
  };

  const mapsString = `C - ${mapData[0].length} - ${mapData.length}\n`;

  for (let i = 0; i < mapData.length; i++) {
    for (let j = 0; j < mapData[i].length; j++) {
      for (let k = 0; k < mapData[i][j].length; k++) {
        if (mapData[i][j][k] instanceof Mountain) {
          grids.mountain.push(`M - ${j} - ${i}\n`);
        }
        if (mapData[i][j][k] instanceof Treasure) {
          grids.treasure.push(
            `T - ${j} - ${i} - ${(mapData[i][j][k] as Treasure).quantity}\n`
          );
        }
        if (mapData[i][j][k] instanceof Adventurer) {
          const p = mapData[i][j][k] as Adventurer;
          grids.adventurer.push(
            `A - ${p.name} - ${j} - ${i} - ${p.orientation} - ${p.treasureCollected}\n`
          );
        }
      }
    }
  }

  return [mapsString]
    .concat(grids.mountain)
    .concat(grids.treasure)
    .concat(grids.adventurer)
    .join("");
};

export {
  createMap,
  initializeMap,
  renderMap,
  moveAdventurer,
  changeOrientation,
  getMapResult,
};
