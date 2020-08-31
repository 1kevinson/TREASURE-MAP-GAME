export enum Orientation {
  NORTH = "N",
  SOUTH = "S",
  WEST = "W",
  EAST = "E",
}

// Position on the multidimensional array Grid
export type GridPosition = {
  x: number; // ordinate
  y: number; // abscissa
};

// The moves of the adventurer
export enum Direction {
  LEFT = "G",
  RIGHT = "D",
}

abstract class Grid {
  value: string;
  protected constructor(value: string) {
    this.value = value;
  }
}

class EmptyGrid extends Grid {
  constructor(value: string) {
    super(value);
  }
}

class Mountain extends Grid {
  constructor(value: string) {
    super(value);
  }
}

class Treasure extends Grid {
  quantity: number;

  constructor(value: string, quantity: number) {
    super(value);
    this.quantity = quantity;
  }

  decrease(): void {
    this.quantity--;
  }

  getValue(): string {
    return `T(${this.quantity})`;
  }
}

class Adventurer extends Grid {
  name: string;
  treasureCollected: number;
  position: GridPosition;
  orientation: Orientation;
  moveSequence: string;

  constructor(
    value: string,
    name: string,
    position: GridPosition,
    orientation: Orientation,
    moveSequence: string
  ) {
    super(value);
    this.name = name;
    this.treasureCollected = 0;
    this.position = position;
    this.orientation = orientation;
    this.moveSequence = moveSequence;
  }

  addTreasure(): void {
    this.treasureCollected++;
  }
}

export { Grid, EmptyGrid, Mountain, Treasure, Adventurer };
