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

  private _matchPause: boolean = false;

  start() {
    this.createBoard();
  }

  update() {
    if (!this.isAnimating && !this._matchPause) {
      this.checkForMatches();
      this._matchPause = false;
    }
  }

  private createBoard() {
    for (let i = 0; i < this._columns; i++) {
      for (let j = 0; j < this._rows; j++) {
        this.createRandomGemAt(i, j);
      }
    }

    // Move the board to the center of the screen
    this.object3d.position.set(-this.boardWidth / 2, 0, 0);
  }

  private createRandomGemAt(column: number, row: number) {
    // Pick a random gem prefab from the list
    const gemPrefab = this.gems[Math.floor(Math.random() * this.gems.length)];
    const gem = gemPrefab.instantiate(this.object3d);
    const gemHandler = RE.getComponent(GemHandler, gem) as GemHandler;
    gemHandler.row = row;
    gemHandler.column = column;
    gem.position.set(column * this._columnWidth, row * this._rowHeight, 0);
    return gemHandler;
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

  private getGem(column: number, row: number): GemHandler {
    const gem = this.object3d.children.find(child => {
      const gemHandler = RE.getComponent(GemHandler, child) as GemHandler;
      return gemHandler.column === column && gemHandler.row === row;
    });
    const gemHandler = RE.getComponent(GemHandler, gem) as GemHandler;
    return gemHandler;
  }

  private checkForMatches() {
    this._matchPause = true;
    // Check horizontal matches
    for (let row = 0; row < this._rows; row++) {
      let rowGems: GemHandler[] = [];
      for (let col = 0; col < this._columns; col++) {
        const gem = this.getGem(col, row);
        rowGems.push(gem);
      }
      // Check for matches in the row
      this.checkForMatchesInRow(rowGems);
    }
  }

  private checkForMatchesInRow(rowGems: GemHandler[]) {
    let currentColor = -1;
    let matchCount = 1;
    let matchingGems: GemHandler[] = [];

    for (let gem of rowGems) {
      if (currentColor === -1) {
        currentColor = gem.color;
        matchingGems.push(gem);
      }
      else if (gem.color === currentColor) {
        matchCount++;
        matchingGems.push(gem);
      }
      else {
        // We have a new color, check if we have a match of 3 or more
        if (matchCount >= 3) {
          RE.Debug.log(`Found match of ${matchCount} gems`);
          for (let gem of matchingGems) {
            let gemRow = gem.row;
            let gemColumn = gem.column;
            gem.object3d.parent?.remove(gem.object3d);
            this.createRandomGemAt(gemColumn, gemRow);
          }
        }

        // Reset for the next potential match
        currentColor = gem.color;
        matchCount = 1;
        matchingGems = [gem];
      }
    }
  }
}
