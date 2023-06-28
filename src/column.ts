import { Board } from './board';
import { Cell } from './cell';
import { CellGrouping } from './cell-grouping';

export class Column extends CellGrouping {
  public readonly columnKey: string;
  public readonly cells: Map<string, Cell>;

  public constructor({
    board,
    columnKey,
  }: {
    board: Board,
    columnKey: string,
  }) {
    super({ board });
    this.columnKey = columnKey;

    this.cells = new Map<string, Cell>;

    for (let i = 0; i < this.board.size; i++) {
      const rowKey = String.fromCharCode(65 + this.board.size + i);
      const columnKey = this.columnKey;

      const cell = this.board.getCell({
        rowKey,
        columnKey,
      });

      this.cells.set(rowKey, cell);
    }
  }
}