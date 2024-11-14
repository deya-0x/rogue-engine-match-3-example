import EASINGS from '@RE/EyeOfMidas/tween/Lib/Easings';
import Tween from '@RE/EyeOfMidas/tween/Lib/Tween';
import * as RE from 'rogue-engine';
import * as THREE from 'three';
import GemHandler from './GemHandler.re';

@RE.registerComponent
export default class BoardHandler extends RE.Component {

  @RE.props.list.prefab()
  public gems: RE.Prefab[] = [];

  private _columns: number = 5;
  private _rows: number = 5;
  private _columnWidth: number = 3;
  private _rowHeight: number = 3;

  private _selectedGem: THREE.Object3D | null = null;

  public get isAnimating(): boolean {
    return Tween.activeTweens.length > 0;
  }

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
        const gemHandler = RE.getComponent(GemHandler, gem) as GemHandler;
        gemHandler.row = j;
        gemHandler.column = i;
        gem.position.set(i * this._columnWidth, j * this._rowHeight, 0);
      }
    }

    // Move the board to the center of the screen
    this.object3d.position.set(-this.boardWidth / 2, 0, 0);
  }

  public get selectedGem(): THREE.Object3D | null {
    return this._selectedGem;
  }

  public selectGem(gem: THREE.Object3D): boolean {
    // Check if we have a gem selected already
    if (this._selectedGem) {
      if (this.swapGems(this._selectedGem, gem)) {
        return true;
      }
      else {
        this._selectedGem = gem;
        return false;
      }
    } else {
      this._selectedGem = gem;
      return false;
    }
  }

  private swapGems(gem1: THREE.Object3D, gem2: THREE.Object3D): boolean {
    // First verify that the gems are adjacent to each other.
    const gem1Handler = RE.getComponent(GemHandler, gem1) as GemHandler;
    const gem2Handler = RE.getComponent(GemHandler, gem2) as GemHandler;

    if (Math.abs(gem1Handler.row - gem2Handler.row) > 1 || Math.abs(gem1Handler.column - gem2Handler.column) > 1) {
      return false;
    }

    const gem1Position = gem1.position.clone();
    const gem2Position = gem2.position.clone();

    Tween.create(gem1.position, gem2Position, 500, EASINGS.Bounce.EaseOut, this.onTweenCompleted.bind(this));
    Tween.create(gem2.position, gem1Position, 500, EASINGS.Bounce.EaseOut, this.onTweenCompleted.bind(this));

    // Swap the gems row and column
    [gem1Handler.row, gem2Handler.row] = [gem2Handler.row, gem1Handler.row];
    [gem1Handler.column, gem2Handler.column] = [gem2Handler.column, gem1Handler.column];

    return true;
  }

  private onTweenCompleted() {
    this._selectedGem = null;
  }
}
