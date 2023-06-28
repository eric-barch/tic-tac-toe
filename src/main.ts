import * as readline from 'readline';

import { Board } from './board';
import { Player } from './player';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askForInput({
  query,
}: {
  query: string
}): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (input) => {
      resolve(input);
    });
  });
}

async function game() {
  let board: Board;
  let currentPlayer = Player.X;

  while (true) {
    try {
      const sizeInput = await askForInput({ query: `\nEnter game board size (3 - 10): ` });
      board = new Board({ size: sizeInput });
      board.display();
    } catch (err) {
      console.log(`${err}`);
      continue;
    }

    break;
  }

  while (true) {
    try {
      const claimInput = await askForInput({
        query: `\nPlayer ${currentPlayer}, enter two characters specifying the row and column you want to claim. Order does not matter (e.g., AF is the same as FA): `
      });
      board.claimCell({
        claim: claimInput,
        player: currentPlayer,
      });
    } catch (err) {
      console.log(`${err}`);
      continue;
    }

    board.display();

    if (board.hasWinner()) {
      console.log(`\nPlayer ${currentPlayer} wins!`);
      break;
    }

    if (board.isFull()) {
      console.log(`\nBoard is full. Game over.`);
      break;
    }

    currentPlayer = (currentPlayer === Player.X) ? Player.O : Player.X;
  }

  rl.close();
}

game();