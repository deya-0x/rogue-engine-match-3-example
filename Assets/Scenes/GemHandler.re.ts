import * as RE from 'rogue-engine';
import * as THREE from 'three';

@RE.registerComponent
export default class GemHandler extends RE.Component {
  
  @RE.props.num() public row: number;
  @RE.props.num() public column: number;

  start() {

  }

  update() {

  }

  public setColor(color: THREE.Color) {
    
  }
}
