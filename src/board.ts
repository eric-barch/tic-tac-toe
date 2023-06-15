import { Cell } from './cell';
import { Player } from './player';
import { Row } from './row';

export class Board {
  private size: number;
  public readonly rows: Map<string, Row>;

  public constructor(size: number) {
    if (size < 3 || size > 10) {
      throw new Error('Board size must be between 3 and 10.');
    }

    this.size = size;
    this.rows = new Map<string, Row>;

    for (let i = 0; i < this.size; i++) {
      const key = String.fromCharCode(65 + size + i);
      const row = new Row(this.size);
      this.rows.set(key, row);
    }
  }

  public display() {
    console.log(`\n  ${this.columnKeys.join(` `)}`);

    for (const rowMap of this.rows) {
      const rowKey = rowMap[0];
      const rowValue = rowMap[1];
      const cellOwners = Array.from(rowValue.cells.values()).map(cell => cell.owner);
      console.log(`${rowKey} ${cellOwners.join(` `)}`);
    }
  }

  public claimCell(rowKey: string, columnKey: string, currentPlayer: Player) {
    const cell = this.getCell(rowKey, columnKey);
    cell.owner = currentPlayer;
  }

  public getCell(rowKey: string, columnKey: string): Cell {
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
    for (const rowKey of this.rowKeys) {
      const rowOwners = new Array<Player>();

      for (const columnKey of this.columnKeys) {
        const cellOwner = this.getCell(rowKey, columnKey).owner;
        rowOwners.push(cellOwner);
      }

      if (this.sameOwner(rowOwners)) {
        return true;
      }
    }

    return false;
  }

  private hasColumnWinner(): boolean {
    for (const columnKey of this.columnKeys) {
      const columnOwners = new Array<Player>();

      for (const rowKey of this.rowKeys) {
        const cellOwner = this.getCell(rowKey, columnKey).owner;
        columnOwners.push(cellOwner);
      }

      if (this.sameOwner(columnOwners)) {
        return true;
      }
    }

    return false;
  }

  private hasDiagonalWinner(): boolean {
    const firstDiagonalOwners = new Array<Player>();
    const secondDiagonalOwners = new Array<Player>();

    for (let i = 0; i < this.size; i++) {
      const firstDiagonalRowKey = this.rowKeys[i];
      const firstDiagonalColumnKey = this.columnKeys[i];

      const secondDiagonalRowKey = this.rowKeys[this.size - i - 1];
      const secondDiagonalColumnKey = this.columnKeys[i];

      const firstDiagonalOwner = this.getCell(firstDiagonalRowKey, firstDiagonalColumnKey).owner;
      const secondDiagonalOwner = this.getCell(secondDiagonalRowKey, secondDiagonalColumnKey).owner;

      firstDiagonalOwners.push(firstDiagonalOwner);
      secondDiagonalOwners.push(secondDiagonalOwner);
    }

    if (this.sameOwner(firstDiagonalOwners) || this.sameOwner(secondDiagonalOwners)) {
      return true;
    }

    return false;
  }

  private sameOwner(cellOwners: Array<Player>): boolean {
    let firstOwner: Player | undefined;
    for (const cellOwner of cellOwners) {
      if (cellOwner === Player.None) {
        return false;
      }

      if (!firstOwner) {
        firstOwner = cellOwner;
      }

      if (cellOwner !== firstOwner) {
        return false;
      }
    }

    return true;
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