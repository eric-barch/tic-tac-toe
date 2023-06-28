import { Board } from './board';
import { Cell } from './cell';
import { CellGrouping } from './cell-grouping';

export class Row extends CellGrouping {
  public readonly rowKey: string;
  public readonly cells: Map<string, Cell>;

  public constructor({
    board,
    rowKey,
  }: {
    board: Board,
    rowKey: string,
  }) {
    super({ board });
    this.rowKey = rowKey;

    this.cells = new Map<string, Cell>;

    for (let i = 0; i < this.board.size; i++) {
      const columnKey = String.fromCharCode(65 + i);
      const cell = new Cell();
      this.cells.set(columnKey, cell);
    }
  }

  public toString(): string {
    const cellOwners = Array.from(this.cells.values()).map(cell => cell.owner);
    const rowString = `${this.rowKey} ${cellOwners.join(` `)}`;
    return rowString;
  }
}