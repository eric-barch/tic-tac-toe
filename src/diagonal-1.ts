import { Board } from './board';
import { Cell } from './cell';
import { CellGrouping } from './cell-grouping';

export class Diagonal1 extends CellGrouping {
  public readonly cells: Map<string, Cell>;

  public constructor({
    board,
  }: {
    board: Board,
  }) {
    super({ board });

    this.cells = new Map<string, Cell>;

    for (let i = 0; i < this.board.size; i++) {
      const rowKey = String.fromCharCode(65 + this.board.size + i);
      const columnKey = String.fromCharCode(65 + i);

      const cell = this.board.getCell({
        rowKey,
        columnKey,
      });

      const key = `${rowKey}${columnKey}`;

      this.cells.set(key, cell);
    }
  }
}