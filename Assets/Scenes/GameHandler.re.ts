import * as RE from 'rogue-engine';
import SceneHandler from './SceneHandler.re';
import BoardHandler from './BoardHandler.re';

@RE.registerComponent
export default class GameHandler extends RE.Component {
  
  private _sceneHandler: SceneHandler;
  private _boardHandler: BoardHandler;

  private container: HTMLDivElement = document.createElement('div');

  async awake() {
    // Thanks BeardScript for this trick to load the stylsheet!
    this.container.style.display = 'none';

    const filePath = RE.getStaticPath('Styles.html');
    const res = await fetch(filePath);

    this.container.innerHTML = await res.text();
    RE.Runtime.uiContainer.append(this.container);
  }

  start() {

    this._sceneHandler = RE.getComponent(SceneHandler, this.object3d);
    this._boardHandler = RE.getComponent(BoardHandler);

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
        // Select the gem
        if (this._boardHandler.selectGem(picked)) {
          // Add this object to the outline shader's list of objects to outline
          this._sceneHandler.outlineObjects = [];
        }
        else {
          this._sceneHandler.outlineObjects = [picked];
        }
      }
    }
  }
}
