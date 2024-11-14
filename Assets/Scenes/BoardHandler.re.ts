import * as RE from 'rogue-engine';

@RE.registerComponent
export default class BoardHandler extends RE.Component {

  @RE.props.list.prefab()
  public gems: RE.Prefab[] = [];

  private _columns: number = 5;
  private _rows: number = 5;
  private _columnWidth: number = 3;
  private _rowHeight: number = 3;

  public get boardWidth(): number {
    return this._columns * this._columnWidth;
  }

  public get boardHeight(): number {
    return this._rows * this._rowHeight;
  }

  start() {
    this.createBoard();
  }

  update() {

  }

  private createBoard() {
    for (let i = 0; i < this._columns; i++) {
      for (let j = 0; j < this._rows; j++) {
        // Pick a random gem prefab from the list
        const gemPrefab = this.gems[Math.floor(Math.random() * this.gems.length)];
        const gem = gemPrefab.instantiate(this.object3d);
        gem.position.set(i * this._columnWidth, j * this._rowHeight, 0);
      }
    }

    // Move the board to the center of the screen
    this.object3d.position.set(-this.boardWidth / 2, 0, 0);
  }
}
