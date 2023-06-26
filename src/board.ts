import { Cell } from './cell';
import { Player } from './player';
import { Row } from './row';

export class Board {
  private readonly size: number;
  private readonly rows: Map<string, Row>;

  public constructor({
    size,
  }: {
    size: string,
  }) {
    const sizeAsNumber = Number(size);

    if (!Number.isInteger(sizeAsNumber)) {
      throw new Error(`Board size must be an integer.`);
    }

    if (sizeAsNumber < 3 || sizeAsNumber > 10) {
      throw new Error('Board size must be between 3 and 10 inclusive.');
    }

    this.size = sizeAsNumber;

    this.rows = new Map<string, Row>;

    for (let i = 0; i < this.size; i++) {
      const key = String.fromCharCode(65 + this.size + i);
      const row = new Row({ size: this.size });
      this.rows.set(key, row);
    }
  }

  public display() {
    // Print column headers
    console.log(`\n  ${this.columnKeys.join(` `)}`);

    // Print rows
    for (const rowMap of this.rows) {
      const rowKey = rowMap[0];
      const rowValue = rowMap[1];
      const cellOwners = Array.from(rowValue.cells.values()).map(cell => cell.owner);
      console.log(`${rowKey} ${cellOwners.join(` `)}`);
    }
  }

  public claimCell({
    claim,
    player,
  }: {
    claim: string,
    player: Player,
  }): Cell {
    if (claim.length !== 2) {
      throw new Error(`Claim must be 2 characters long.`);
    }

    const alphabetizedKeys = claim.toUpperCase().split('').sort();
    const columnKey = alphabetizedKeys[0];
    const rowKey = alphabetizedKeys[1];

    if (!(this.rowKeys.includes(rowKey)) || !(this.columnKeys.includes(columnKey))) {
      throw new Error(`Input does not match a row and column combination on this board.`);
    }

    const cell = this.getCell({ rowKey, columnKey });
    cell.claim({ player });

    return cell;
  }

  public getCell({
    rowKey,
    columnKey,
  }: {
    rowKey: string,
    columnKey: string,
  }): Cell {
    const row = this.rows.get(rowKey);

    if (!row) {
      throw new Error(`row is undefined.`);
    }

    const cell = row.cells.get(columnKey);

    if (!cell) {
      throw new Error(`cell is undefined.`);
    }

    return cell;
  }

  public isFull(): boolean {
    for (const row of this.rows.values()) {
      if (!row.isFull()) {
        return false;
      }
    }

    return true;
  }

  public hasWinner(): boolean {
    if (this.hasRowWinner() || this.hasColumnWinner() || this.hasDiagonalWinner()) {
      return true;
    }

    return false;
  }

  private hasRowWinner(): boolean {
    for (const row of this.rows.values()) {
      if (row.hasWinner()) {
        return true;
      }
    }

    return false;
  }

  private hasColumnWinner(): boolean {
    for (const columnKey of this.columnKeys) {
      const columnCells = new Array<Cell>();

      for (const rowKey of this.rowKeys) {
        const cell = this.getCell({ rowKey, columnKey });
        columnCells.push(cell);
      }

      if (Cell.sameOwner({ cells: columnCells })) {
        return true;
      }
    }

    return false;
  }

  private hasDiagonalWinner(): boolean {
    const firstDiagonalCells = new Array<Cell>();
    const secondDiagonalCells = new Array<Cell>();

    for (let i = 0; i < this.size; i++) {
      const firstDiagonalRowKey = this.rowKeys[i];
      const firstDiagonalColumnKey = this.columnKeys[i];

      const secondDiagonalRowKey = this.rowKeys[this.size - i - 1];
      const secondDiagonalColumnKey = this.columnKeys[i];

      const firstDiagonalCell = this.getCell({
        rowKey: firstDiagonalRowKey,
        columnKey: firstDiagonalColumnKey,
      });
      const secondDiagonalCell = this.getCell({
        rowKey: secondDiagonalRowKey,
        columnKey: secondDiagonalColumnKey,
      });

      firstDiagonalCells.push(firstDiagonalCell);
      secondDiagonalCells.push(secondDiagonalCell);
    }

    if (Cell.sameOwner({ cells: firstDiagonalCells }) || Cell.sameOwner({ cells: secondDiagonalCells })) {
      return true;
    }

    return false;
  }

  public get columnKeys(): Array<string> {
    const firstRow = this.rows.values().next().value;

    if (!(firstRow instanceof Row)) {
      throw new Error(`firstRow is not a Row.`);
    }

    const cellKeys = Array.from(firstRow.cells.keys());
    return cellKeys;
  }

  public get rowKeys(): Array<string> {
    return Array.from(this.rows.keys());
  }
}