import { Player } from './player';

export class Cell {
  private wrappedOwner: Player = Player.None;

  public set owner(owner: Player) {
    if (this.owner === Player.None) {
      this.wrappedOwner = owner;
    } else {
      throw new Error('Cell has already been claimed.');
    }
  }

  get owner(): Player {
    return this.wrappedOwner;
  }
}