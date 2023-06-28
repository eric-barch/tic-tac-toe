import { Cell } from './cell';
import { Player } from './player';
import { Row } from './row';
import { Column } from './column';
import { Diagonal1 } from './diagonal-1';
import { Diagonal2 } from './diagonal-2';

export class Board {
  public readonly size: number;
  private readonly rows: Map<string, Row>;
  private readonly columns: Map<string, Column>;
  private readonly diagonal1: Diagonal1;
  private readonly diagonal2: Diagonal2;

  public constructor({
    size,
  }: {
    size: string | number,
  }) {
    const sizeAsNumber = Number(size);

    if (!Number.isInteger(sizeAsNumber)) {
      throw new Error(`Board size must be an integer.`);
    }

    if (sizeAsNumber < 3 || sizeAsNumber > 10) {
      throw new Error('Board size must be between 3 and 10 inclusive.');
    }

    this.size = sizeAsNumber;

    // Generate Rows and Cells
    this.rows = new Map<string, Row>;

    for (let i = 0; i < this.size; i++) {
      const rowKey = String.fromCharCode(65 + this.size + i);
      const row = new Row({
        board: this,
        rowKey,
      });
      this.rows.set(rowKey, row);
    }

    // Assign Cells to Columns
    this.columns = new Map<string, Column>;

    for (let i = 0; i < this.size; i++) {
      const columnKey = String.fromCharCode(65 + i);
      const column = new Column({
        board: this,
        columnKey,
      });
      this.columns.set(columnKey, column);
    }

    // Assign Cells to Diagonal 1
    this.diagonal1 = new Diagonal1({ board: this });

    // Assign Cells to Diagonal 2
    this.diagonal2 = new Diagonal2({ board: this });
  }

  public display() {
    // Print column headers
    console.log(`\n  ${this.columnKeys.join(` `)}`);

    // Print rows
    for (const row of this.rows.values()) {
      console.log(row.toString());
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

    const cell = this.getCell({
      rowKey,
      columnKey,
    });

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
    for (const column of this.columns.values()) {
      if (column.hasWinner()) {
        return true;
      }
    }

    return false;
  }

  private hasDiagonalWinner(): boolean {
    if (this.diagonal1.hasWinner()) {
      return true;
    }

    if (this.diagonal2.hasWinner()) {
      return true;
    }

    return false;
  }

  public get columnKeys(): Array<string> {
    return Array.from(this.columns.keys());
  }

  public get rowKeys(): Array<string> {
    return Array.from(this.rows.keys());
  }
}