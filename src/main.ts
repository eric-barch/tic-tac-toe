import * as readline from 'readline';

enum Player {
  X = 'X',
  O = 'O',
  None = ' ',
}

class Cell {
  private wrappedOwner: Player;

  constructor() {
    this.wrappedOwner = Player.None;
  }

  public set owner(owner: Player) {
    if (this.owner === Player.None) {
      this.wrappedOwner = owner;
    }
  }

  get owner(): Player {
    return this.wrappedOwner;
  }
}

class Board {
  private size: number;
  private board: Map<string, Map<string, Cell>>;

  public constructor(size: number) {
    if (size < 3 || size > 10) {
      throw new Error('Size must be between 3 and 10');
    }

    this.size = size;

    this.board = new Map<string, Map<string, Cell>>();

    for (let i = 0; i < size; i++) {
      let row = new Map<string, Cell>();
      for (let j = 0; j < size; j++) {
        let cell = new Cell();
        row.set(String.fromCharCode(65 + j), cell);
      }
      this.board.set(String.fromCharCode(65 + size + i), row)
    }
  }

  public displayBoard() {
    let firstRow = Array.from(this.board.values())[0];
    let headerLine = "\n  " + Array.from(firstRow.keys()).join(' ');

    console.log(headerLine);

    for (let [rowKey, rowValue] of this.board) {
      let rowLine = rowKey + " ";

      for (let cell of rowValue.values()) {
        rowLine += cell.owner + " ";
      }

      console.log(rowLine);
    }
  }

  public markCell(columnCoordinate: string, rowCoordinate: string, owner: Player) {
    const row = this.board.get(rowCoordinate);
    if (!row) {
      throw new Error('Invalid row coordinate');
    }

    const cell = row.get(columnCoordinate);
    if (!cell) {
      throw new Error('Invalid column coordinate');
    }

    cell.owner = owner;
  }

  public checkWin(): boolean {
    const rowWin = this.checkRowWin();
    const columnWin = this.checkColumnWin();
    const diagonalWin = this.checkDiagonalWin();

    if (rowWin || columnWin || diagonalWin) {
      return true;
    }

    return false;
  }

  private checkRowWin(): boolean {
    for (const row of this.board.values()) {
      let rowValues = Array.from(row.values());
      let firstOwner = rowValues[0]?.owner;

      if (firstOwner === Player.None) {
        continue;
      }

      let allSameOwner = rowValues.every(cell => cell.owner === firstOwner);

      if (allSameOwner) {
        return true;
      }
    }

    return false;
  }

  private checkColumnWin(): boolean {
    if (this.board.size === 0) return false; // No columns to check if board is empty

    const firstRowKey = Array.from(this.board.keys())[0];
    const firstRow = this.board.get(firstRowKey);

    // Iterate over each column
    for (const columnKey of firstRow?.keys() ?? []) {
      let columnValues = Array.from(this.board.values()).map(row => row.get(columnKey));
      let firstValidOwner = columnValues.find(cell => cell?.owner !== Player.None)?.owner;

      // if no valid owner found in column, move on to next column
      if (firstValidOwner === undefined) {
        continue;
      }

      let allSameOwner = columnValues.every(cell => cell?.owner === firstValidOwner);

      // If all cells in column have same owner (not Player.None), we have a win
      if (allSameOwner) {
        return true;
      }
    }

    // No winning column found
    return false;
  }

  private checkDiagonalWin(): boolean {
    const size = this.board.size;
    const rowKeys = Array.from(this.board.keys());
    const columnKeys = Array.from(this.board.get(rowKeys[0])?.keys() ?? []);

    // Check top-left to bottom-right diagonal
    let topLeftDiagonalOwner = this.board.get(rowKeys[0])?.get(columnKeys[0])?.owner;
    for (let i = 1; i < size; i++) {
      if (this.board.get(rowKeys[i])?.get(columnKeys[i])?.owner !== topLeftDiagonalOwner) {
        topLeftDiagonalOwner = Player.None;
        break;
      }
    }

    // Check top-right to bottom-left diagonal
    let topRightDiagonalOwner = this.board.get(rowKeys[0])?.get(columnKeys[size - 1])?.owner;
    for (let i = 1; i < size; i++) {
      if (this.board.get(rowKeys[i])?.get(columnKeys[size - 1 - i])?.owner !== topRightDiagonalOwner) {
        topRightDiagonalOwner = Player.None;
        break;
      }
    }

    // If all cells in either diagonal are owned by the same player (not None), return true
    return topLeftDiagonalOwner !== Player.None || topRightDiagonalOwner !== Player.None;
  }
}

const game = new Board(3);
let currentPlayer = Player.X;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string) => new Promise<string>(resolve =>
  rl.question(query, answer => resolve(answer))
);

async function gameLoop() {
  while (true) {
    game.displayBoard();
    const input = await askQuestion(`\nPlayer ${currentPlayer}, enter your move. Order does not matter (e.g., AF is the same as FA): `);

    if (input.length !== 2) {
      console.log('Invalid input. Please enter two characters that identify row and column (or vice versa).');
      continue;
    }

    const sortedCoordinates = input.toUpperCase().split("").sort();
    const columnCoordinate = sortedCoordinates[0];
    const rowCoordinate = sortedCoordinates[1];

    game.markCell(columnCoordinate, rowCoordinate, currentPlayer);

    if (game.checkWin()) {
      game.displayBoard();
      console.log(`\nPlayer ${currentPlayer} wins!`);
      rl.close();
      break;
    }

    currentPlayer = currentPlayer === Player.X ? Player.O : Player.X;
  }
}

gameLoop();