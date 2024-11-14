import * as RE from 'rogue-engine'
import * as THREE from 'three'
import Tween from '../Lib/Tween'
import EASINGS from '../Lib/Easings'

export default class TweenPosition extends RE.Component {
  @RE.props.button() run = this.addMoveTween.bind(this)

  @RE.props.vector3() targetPosition: THREE.Vector3 = new THREE.Vector3(-3, 3, -10)
  @RE.props.num() durationMillis: number = 2000
  @RE.props.select() easing = 8;
  easingOptions = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];

  @RE.props.select() easingDirection = 2;
  easingDirectionOptions = ["EaseNone", "EaseIn", "EaseOut", "EaseInOut"];

  firstPosition = new THREE.Vector3(-3, 3, 0)
  secondPosition = new THREE.Vector3(-3, 3, -10)
  awake() {
    this.targetPosition = this.secondPosition.clone()
  }

  start() {

  }

  update() {

  }


  addMoveTween() {
    Tween.create(this.object3d.position, this.targetPosition, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]], this.onCompleted.bind(this))
  }

  onCompleted() {
    if (this.targetPosition.equals(this.firstPosition)) {
      this.targetPosition = this.secondPosition.clone()
    } else {
      this.targetPosition = this.firstPosition.clone()
    }
  }
}

RE.registerComponent(TweenPosition);
