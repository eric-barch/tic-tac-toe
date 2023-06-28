import { Board } from './board';
import { Cell } from './cell';
import { Player } from './player';

export abstract class CellGrouping {
  protected readonly board: Board;
  public abstract readonly cells: Map<string, Cell>;

  public constructor({
    board,
  }: {
    board: Board,
  }) {
    this.board = board;
  }

  public hasWinner(): boolean {
    const cells = Array.from(this.cells.values());

    if (Cell.sameOwner({ cells })) {
      return true;
    }

    return false;
  }

  public isFull(): boolean {
    for (const cell of this.cells.values()) {
      if (cell.owner === Player.None) {
        return false;
      }
    }

    return true;
  }
}