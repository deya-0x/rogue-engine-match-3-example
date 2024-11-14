import * as RE from 'rogue-engine'
import * as THREE from 'three'
import Tween from '../Lib/Tween'
import EASINGS from '../Lib/Easings'

export default class TweenRotation extends RE.Component {
  @RE.props.button() run = this.addRotateTween.bind(this)

  @RE.props.vector3() targetRotationDegrees: THREE.Vector3 = new THREE.Vector3(0, 90, 90)
  @RE.props.num() durationMillis: number = 2000
  @RE.props.select() easing = 1;
  easingOptions = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];

  @RE.props.select() easingDirection = 3;
  easingDirectionOptions = ["EaseNone", "EaseIn", "EaseOut", "EaseInOut"];

  firstRotation = new THREE.Vector3(0, 0, 0)
  secondRotation = new THREE.Vector3(0, 90, 90)
  awake() {
    this.targetRotationDegrees = this.secondRotation.clone()
  }

  addRotateTween() {
    const rotationInRadians = this.targetRotationDegrees.clone().multiplyScalar(Math.PI / 180)
    Tween.create(this.object3d.rotation, rotationInRadians, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]], this.onCompleted.bind(this))
  }

  onCompleted() {
    if (this.targetRotationDegrees.equals(this.firstRotation)) {
      this.targetRotationDegrees = this.secondRotation.clone()
    } else {
      this.targetRotationDegrees = this.firstRotation.clone()
    }
  }
}

RE.registerComponent(TweenRotation);
