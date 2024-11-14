import * as RE from 'rogue-engine';
import SceneHandler from './SceneHandler.re';

@RE.registerComponent
export default class GameHandler extends RE.Component {
  
  private _sceneHandler: SceneHandler;

  start() {
    this._sceneHandler = RE.getComponent(SceneHandler, this.object3d);

    // Set up the input action map for the game
    RE.Input.setActionMap({
      Select: { type: "Button", Mouse: 0, Touch: "Tap" },
    });
  }

  update() {
    // Check if the "Select" action mapping is pressed
    if (RE.Input.getDown("Select")) {
      // Get all objects in the scene with the "Clickable" tag
      const targets = RE.Tags.getWithAll("Clickable");
      // Pick the one under the pointer device.
      const picked = RE.pick(targets);
  
      if (picked) {
        RE.Debug.log(picked.name);
        this._sceneHandler.outlineObjects = [picked];
      }
    }
  }
}
