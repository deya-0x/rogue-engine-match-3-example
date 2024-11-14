import RogueCSS2D from '@RE/RogueEngine/rogue-css2d/RogueCSS2D.re';
import * as RE from 'rogue-engine';
import * as THREE from 'three';

@RE.registerComponent
export default class GemHandler extends RE.Component {
  @RE.props.select() public color: number;
  colorOptions = ["Red", "Blue", "Green", "Yellow", "Purple"];
  @RE.props.num() public row: number;
  @RE.props.num() public column: number;

  public css2dObject: RogueCSS2D;

  start() {
    this.css2dObject = RE.getComponent(RogueCSS2D, this.object3d);

    this.css2dObject.div.className = `gem ${this.colorOptions[this.color]}`;
  }

  update() {
    const colorStr = this.colorOptions[this.color];
    this.css2dObject.content = `${colorStr}<br>${this.row}, ${this.column}`;
  }

  
}
