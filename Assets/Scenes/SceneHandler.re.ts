import * as RE from 'rogue-engine';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

@RE.registerComponent
export default class SceneHandler extends RE.Component {

  private _outlinePass: OutlinePass;
  private _renderPass: RenderPass;
  private _fxaaPass: ShaderPass;
  private _outputPass: OutputPass;
  private _composer: EffectComposer;

  start() {
    this._renderPass = new RenderPass(RE.Runtime.scene, RE.Runtime.camera);
    this._fxaaPass = new ShaderPass(FXAAShader);
    this._fxaaPass.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    this._outputPass = new OutputPass();

    this._outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), RE.Runtime.scene, RE.Runtime.camera );
    this._outlinePass.edgeStrength = 3.5;
    this._outlinePass.edgeGlow = 0.05;
    this._outlinePass.edgeThickness = 1.0;
    this._outlinePass.pulsePeriod = 2.0;
    this._outlinePass.visibleEdgeColor.set( '#ffffff' );
    this._outlinePass.hiddenEdgeColor.set( '#000000' );

    this._composer = new EffectComposer(RE.Runtime.renderer);
    this._composer.addPass(this._renderPass);
    this._composer.addPass(this._outlinePass);
    this._composer.addPass(this._outputPass);
    this._composer.addPass(this._fxaaPass);

    RE.Runtime.renderFunc = this.renderScene;
  }

  get outlineObjects(): THREE.Object3D[] {
    return this._outlinePass.selectedObjects;
  }

  set outlineObjects(objects: THREE.Object3D[]) {
    this._outlinePass.selectedObjects = objects;
  }

  update() {

  }

  renderScene() {
    this._composer.render();
  }
}
