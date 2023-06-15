import { Cell } from './cell';
import { Player } from './player';

export class Row {
  private size: number;
  public readonly cells: Map<string, Cell>;

  public constructor(size: number) {
    this.size = size;
    this.cells = new Map<string, Cell>;

    for (let i = 0; i < this.size; i++) {
      const key = String.fromCharCode(65 + i);
      const cell = new Cell();
      this.cells.set(key, cell);
    }
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