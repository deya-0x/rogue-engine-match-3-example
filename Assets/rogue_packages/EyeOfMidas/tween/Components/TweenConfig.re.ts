import * as RE from 'rogue-engine';
import Tween from '../Lib/Tween';

export default class TweenConfig extends RE.Component {
  awake() {

  }

  start() {

  }

  update() {
    Tween.update()
  }
}

RE.registerComponent(TweenConfig);
