import * as RE from 'rogue-engine'
import * as THREE from 'three'
import Tween from '../Lib/Tween'
import EASINGS from '../Lib/Easings'

export default class TweenScale extends RE.Component {
  @RE.props.button() run = this.addScaleTween.bind(this)

  @RE.props.vector3() targetScale: THREE.Vector3 = new THREE.Vector3(2, 2, 2)
  @RE.props.num() durationMillis: number = 2000
  @RE.props.select() easing = 10;
  easingOptions = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sinusoidal", "Exponential", "Circular", "Elastic", "Back", "Bounce"];

  @RE.props.select() easingDirection = 2;
  easingDirectionOptions = ["EaseNone", "EaseIn", "EaseOut", "EaseInOut"];

  firstScale = new THREE.Vector3(1, 1, 1)
  secondScale = new THREE.Vector3(2, 2, 2)
  awake() {
    this.targetScale = this.secondScale.clone()
  }

  start() {

  }

  update() {

  }


  addScaleTween() {
    Tween.create(this.object3d.scale, this.targetScale, this.durationMillis, EASINGS[this.easingOptions[this.easing]][this.easingDirectionOptions[this.easingDirection]], this.onCompleted.bind(this))
  }

  onCompleted() {
    if (this.targetScale.equals(this.firstScale)) {
      this.targetScale = this.secondScale.clone()
    } else {
      this.targetScale = this.firstScale.clone()
    }
  }
}

RE.registerComponent(TweenScale);
