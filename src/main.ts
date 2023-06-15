import * as readline from 'readline';

import { Board } from './board';
import { Player } from './player';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string) => new Promise<string>(resolve =>
  rl.question(query, answer => resolve(answer))
);

async function game() {
  let board: Board;
  let currentPlayer = Player.X;

  while (true) {
    const input = await askQuestion(`\nEnter the size of the game board (3 - 10): `);
    const inputNumber = Number(input);

    if (!(Number.isInteger(inputNumber) && inputNumber >= 3 && inputNumber <= 10)) {
      console.log(`Invalid input. Enter a number between 3 and 10 inclusive.`);
      continue;
    }

    board = new Board(inputNumber);
    break;
  }

  while (true) {
    board.display();
    const input = await askQuestion(`\nPlayer ${currentPlayer}, enter two characters specifying the row and column you want to claim. Order does not matter (e.g., AF is the same as FA): `);

    if (input.length !== 2) {
      console.log(`Invalid input. Enter two characters specifying the row and column you want to claim.`);
      continue;
    }

    const sortedKeys = input.toUpperCase().split(``).sort();
    const columnKey = sortedKeys[0];
    const rowKey = sortedKeys[1];

    if (!(board.rowKeys.includes(rowKey)) || !(board.columnKeys.includes(columnKey))) {
      console.log(`Invalid input. Enter two characters specifying the row and column you want to claim.`);
      continue;
    }

    try {
      board.claimCell(rowKey, columnKey, currentPlayer);
    } catch (err) {
      console.log(`Invalid selection. ${err}`);
      continue;
    }

    if (board.hasWinner()) {
      board.display();
      console.log(`\nPlayer ${currentPlayer} wins!`);
      rl.close();
      break;
    }

    if (board.isFull()) {
      board.display();
      console.log(`\nBoard is full. Game over.`);
      rl.close();
      break;
    }

    currentPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
  }
}

game();