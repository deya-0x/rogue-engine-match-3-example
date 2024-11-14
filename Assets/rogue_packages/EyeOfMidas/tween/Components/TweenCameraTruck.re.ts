import * as RE from 'rogue-engine'
import * as THREE from 'three'
import Tween from '../Lib/Tween'
import EASINGS from '../Lib/Easings'

export default class TweenCameraTruck extends RE.Component {
  @RE.props.button() run = this.addMoveTween.bind(this)

  @RE.props.vector3() targetCameraPosition: THREE.Vector3 = new THREE.Vector3(-3, 3, -10)
  @RE.props.vector3() targetFocusPosition: THREE.Vector3 = new THREE.Vector3(-3, 3, -10)
  @RE.props.num() durationMillis: number = 2000
  @RE.props.select() easing = 1;
  easingOptions = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];

  @RE.props.select() easingDirection = 3;
  easingDirectionOptions = ["EaseNone", "EaseIn", "EaseOut", "EaseInOut"];

  @RE.props.object3d() cameraTarget: THREE.Object3D

  firstCameraPosition = new THREE.Vector3(-11.627, 6.991, -16.249)
  secondCameraPosition = new THREE.Vector3(6, 6.991, -12)
  firstFocusPosition = new THREE.Vector3(0, 0, 0)
  secondFocusPosition = new THREE.Vector3(17.627, 0, 4.249)
  awake() {
    this.targetCameraPosition = this.secondCameraPosition.clone()
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
    Tween.create(this.object3d.position, this.targetCameraPosition, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]], this.onCompleted.bind(this))
    Tween.create(this.cameraTarget.position, this.targetFocusPosition, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]])
  }

  onCompleted() {
    if (this.targetCameraPosition.equals(this.firstCameraPosition)) {
      this.targetCameraPosition = this.secondCameraPosition.clone()
      this.targetFocusPosition = this.secondFocusPosition.clone()
    } else {
      this.targetCameraPosition = this.firstCameraPosition.clone()
      this.targetFocusPosition = this.firstFocusPosition.clone()
    }
  }
}

RE.registerComponent(TweenCameraTruck);
