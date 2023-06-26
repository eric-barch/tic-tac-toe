import { Player } from './player';

export class Cell {
  private wrappedOwner: Player;

  constructor() {
    this.wrappedOwner = Player.None;
  }

  public claim({
    player,
  }: {
    player: Player,
  }): Cell {
    if (this.owner === Player.None) {
      this.owner = player;
      return this;
    }

    throw new Error(`Cell has already been claimed.`);
  }

  public static sameOwner({
    cells,
  }: {
    cells: Array<Cell>,
  }): boolean {
    let firstOwner: Player | undefined;

    for (const cell of cells) {
      if (cell.owner === Player.None) {
        return false;
      }

      if (!firstOwner) {
        firstOwner = cell.owner;
      }

      if (cell.owner !== firstOwner) {
        return false;
      }
    }

    return true;
  }

  private set owner(owner: Player) {
    this.wrappedOwner = owner;
  }

  public get owner(): Player {
    return this.wrappedOwner;
  }
}