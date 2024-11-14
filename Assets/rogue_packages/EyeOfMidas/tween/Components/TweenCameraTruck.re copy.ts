import * as RE from 'rogue-engine'
import * as THREE from 'three'
import Tween from '../Lib/Tween'
import EASINGS from '../Lib/Easings'

export default class TweenCameraPan extends RE.Component {
  @RE.props.button() run = this.addMoveTween.bind(this)

  @RE.props.vector3() targetFocusPosition: THREE.Vector3 = new THREE.Vector3(-3, 3, -10)
  @RE.props.num() durationMillis: number = 2000
  @RE.props.select() easing = 5;
  easingOptions = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];

  @RE.props.select() easingDirection = 3;
  easingDirectionOptions = ["EaseNone", "EaseIn", "EaseOut", "EaseInOut"];

  @RE.props.object3d() cameraTarget: THREE.Object3D

  firstFocusPosition = new THREE.Vector3(0, 0, 0)
  secondFocusPosition = new THREE.Vector3(17.627, 0, 4.249)
  awake() {
    this.targetFocusPosition = this.secondFocusPosition.clone()
  }

  start() {

  }

  update() {
    if(this.cameraTarget) {
      this.object3d.lookAt(this.cameraTarget.position)
    } else {
      RE.Debug.logWarning("Camera has no look-at target set!")
    }
  }


  addMoveTween() {
    Tween.create(this.cameraTarget.position, this.targetFocusPosition, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]], this.onCompleted.bind(this))
  }

  onCompleted() {
    if (this.targetFocusPosition.equals(this.firstFocusPosition)) {
      this.targetFocusPosition = this.secondFocusPosition.clone()
    } else {
      this.targetFocusPosition = this.firstFocusPosition.clone()
    }
  }
}

RE.registerComponent(TweenCameraPan);
