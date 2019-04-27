import React from 'react';
import { vec3 } from 'gl-matrix';
import Scene from './Scene';
import Tree from '../App/Tree';
import Line from './EditorUI/Line';

import Event from './Event';
import ModelRenderer from './Render/ModelRenderer';
import ModelInstance from './Models/ModelInstance';
import './style.css';
import BackgroundLine from './EditorUI/Line/BackgroundLine';
const greenCube = require('./resources/cube-logo-green.png');
const blueCube = require('./resources/cube-logo-blue.png');
const redCube = require('./resources/cube-logo-red.png');

export var Transform = function(x, y, z, rx, ry, rz, sx, sy, sz) {
  this.position = vec3.fromValues(x, y, z);
  this.rotation = vec3.fromValues(rx, ry, rz);
  this.scale = vec3.fromValues(sx, sy, sz);
};
//()=>{this.UpdateEvent.detach(this.Main); to detach functions from event

export default class WebGL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: {},
      counter: 0,
      selectedNode: null,
      selectedTransform: new Transform(1, 1, 1, 0, 0, 0, 1, 1, 1),
      translateBox: false,
      rotateBox: false,
      scaleBox: false
    };
    this.scene = null;
    // this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.selectedChanged = new Event(this);

    this.selectedChanged.attach(function(sender,args){
      sender._treeSelect(args);
    });
    
  }

  componentDidMount() {
    this.UpdateEvent = null;
    this.scene = new Scene('webgl',this);
    this.Main = this.UpdateEvent.attach(function(_scene,_webgl){//_scene: scene instance,_webgl: this
      //args.updateRotation(0, 0, 0.3);
      if(!_webgl.state.selectedNode){
        return;
      }
      let time = _scene.time;
      if(_webgl.state.rotateBox){
        _webgl.state.selectedNode.modelInstance.updateRotation(0, 0, 0.3);
      }
      if(_webgl.state.scaleBox){
        let k = (Math.sin(time*16) * 0.01)+1;
        _webgl.state.selectedNode.modelInstance.scale(k, k, k);
      }
      if(_webgl.state.translateBox){
        _webgl.state.selectedNode.modelInstance.translate(0, Math.sin(time * 8) * 0.02, 0);
      }
      
      //_scene.time
    });
    this.setState({
      tree: this.scene.modelRenderer.tree,
      counter: this.state.counter + 1,
    });
  }

  nodeToTransform = node => {
    const mi = node.modelInstance;
    const transform = new Transform(
      mi.x,
      mi.y,
      mi.z,
      mi.rx,
      mi.ry,
      mi.rz,
      mi.sx,
      mi.sy,
      mi.sz,
    );
    return transform;
  };

  treeSelect = node => {
    this.setState({ selectedNode: node });
    this.selectedChanged.notify(node);
    //this._treeSelect(node);
  };
  //Bu fonksiyon hemen üstündeki fonksiyon ile beraber
  _treeSelect(node){
    const transform = this.nodeToTransform(node);
    this.setState({ selectedTransform: transform });
    
    this.refs.linePos.onNodeSelect(transform);
    this.refs.lineRot.onNodeSelect(transform);
    this.refs.lineScale.onNodeSelect(transform);
  }

  onKeyPressed = e => {
    if (e.keyCode == 46) {
      // this.state.tree.children[this.state.selectedNode.name];
      this.deleteFromTree(this.state.selectedNode);
    }
  };

  deleteFromTree = node => {
    const arr = this.state.tree.children;
    const key = 'name';
    const value = node.name;
    const i = this.functiontofindIndexByKeyValue(arr, key, value);
    arr.splice(i, 1);
  };

  functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (let i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

  sliderChange = (e) =>{
    const _scene = this.scene;
    let fovOrX = true;
    if(fovOrX){
      const slider = this.refs.slider;
      slider.defaultValue=30;
      slider.min = 30;
      slider.max = 150;
      slider.step = 1;
      _scene.camera.fov = e.target.value;
      _scene.camera.generateMatrices();

    }else{
      _scene.camera.x = e.target.value;
      _scene.camera.generateMatrices();
    }
    
  }

  render() {
    return (
      <div onKeyDown={this.onKeyPressed} tabIndex="0" className="allDivs">
        <div className="leftDiv">
          <Tree treeData={this.state.tree} onSelect={this.treeSelect} />
        </div>
        <div className="midDiv">
          <canvas
            id="webgl"
            width="700"
            height="700"
            style={{ border: '1px solid black' }}
          />
          <div className="cubesContainer">
            <img onClick={this.handleClickGreen} src={greenCube} />
            <img onClick={this.handleClickBlue} src={blueCube} />
            <img onClick={this.handleClickRed} src={redCube} />
          </div>
        </div>

        <div className="rightDiv">
          <div className="transformDiv">
            <h3>Transform</h3>
            <Line
              ref="linePos"
              lineType="Position"
              values={this.state.selectedTransform.position}
              translate={this.translate}
              action={this.setPosition}
            />
            <Line
              ref="lineRot"
              lineType="Rotation"
              values={this.state.selectedTransform.rotation}
              rotate={this.rotate}
              action={this.setRotation}

            />
            <Line
              ref="lineScale"
              lineType="Scale"
              values={this.state.selectedTransform.scale}
              scale={this.scale}
              action={this.setScale}
              
            />
            <div>
            <label>
              Translate Animation: 
              <input
                name="translateBox"
                type="checkbox"
                checked={this.state.translateBox}
                onChange={this.handleCheckBoxChange} />
            </label>
            <br/>
            <label>
              Rotate Animation: 
              <input
                name="rotateBox"
                type="checkbox"
                checked={this.state.rotateBox}
                onChange={this.handleCheckBoxChange} />
            </label>
            <br/>
            <label>
              Scale Animation: 
              <input
                name="scaleBox"
                type="checkbox"
                checked={this.state.scaleBox}
                onChange={this.handleCheckBoxChange} />
            </label>
            <br/>
            <label>Camera X:
              <input ref='slider' defaultValue='0' type="range" min='-5' max='5' step ='0.25' onChange={this.sliderChange}></input>
            </label>
            </div>
            
          </div>
          <div>
            <BackgroundLine
              lineType="Background"
              values={this.scene ? this.scene.backgroundColor : [1, 1, 1]}
              changeBG={this.changeBG}
            />
          </div>
        </div>
      </div>
    );
  }

  changeBG = (x, y, z) => {
    if (this.scene) this.scene.backgroundColor = [x, y, z];
  };

  setPosition = (x,y,z) => {
    const obj = this.state.selectedNode;
    if (obj) obj.modelInstance.setPosition(x, y, z);
  };
  setRotation = (x,y,z) => {
    const obj = this.state.selectedNode;
    if (obj) obj.modelInstance.setRotation(x, y, z);
  };
  setScale = (x,y,z) => {
    const obj = this.state.selectedNode;
    if (obj) obj.modelInstance.setScale(x, y, z);
  };

  UpdateGUI = (transform) => {
    this.refs.linePos.onNodeSelect(transform);
    this.refs.lineRot.onNodeSelect(transform);
    this.refs.lineScale.onNodeSelect(transform);
  };

  translate = (x, y, z) => {
    const obj = this.state.selectedNode;
    if (obj){
      obj.modelInstance.translate(x, y, z);
    } 
  };

  rotate = (x, y, z) => {
    const obj = this.state.selectedNode;
    if (obj) obj.modelInstance.updateRotation(x, y, z);
  };

  scale = (x, y, z) => {
    const obj = this.state.selectedNode;
    if (obj) {
      if (x == 0) x = 1;
      if (y == 0) y = 1;
      if (z == 0) z = 1;
      obj.modelInstance.scale(x, y, z);
    }
  };

  handleClickGreen = () => {
    const scene = this.scene;
    const x = Math.floor(Math.random() * 10 - 5);
    const y = Math.floor(Math.random() * 10 - 5);
    const z = Math.floor(Math.random() * 10 - 5);

    const instance = new ModelInstance(x, y, z, x, y, z);

    scene.modelRenderer.addInstance(
      instance,
      'cubeG',
      `green${this.state.counter.toString()}`,
    );

    this.setState({
      tree: scene.modelRenderer.tree,
      counter: this.state.counter + 1,
    });
  };

  handleClickBlue = () => {
    const scene = this.scene;
    const x = Math.floor(Math.random() * 10 - 5);
    const y = Math.floor(Math.random() * 10 - 5);
    const z = Math.floor(Math.random() * 10 - 5);

    const instance = new ModelInstance(x, y, z, x, y, z);

    scene.modelRenderer.addInstance(
      instance,
      'cubeB',
      `blue${this.state.counter.toString()}`,
    );

    this.setState({
      tree: scene.modelRenderer.tree,
      counter: this.state.counter + 1,
    });
  };

  handleClickRed = () => {
    const scene = this.scene;
    const x = Math.floor(Math.random() * 10 - 5);
    const y = Math.floor(Math.random() * 10 - 5);
    const z = Math.floor(Math.random() * 10 - 5);

    const instance = new ModelInstance(x, y, z, x, y, z);

    scene.modelRenderer.addInstance(
      instance,
      'cubeR',
      `red${this.state.counter.toString()}`,
    );

    this.setState({
      tree: scene.modelRenderer.tree,
      counter: this.state.counter + 1,
    });
  };

  handleClick2(event) {
    const obj = this.state.selectedNode;
    if (obj) obj.modelInstance.translate(1, 0, 0);
  }

  findObject = (selectedNode,name) => {
    let objName;
    if (selectedNode != null) {
      objName = selectedNode.name;
      if (objName != 'origin') {
        const arr = this.state.tree.children;
        const obj = arr.find(node => node.name == objName);
        return obj;
      }
    }
  };

  handleCheckBoxChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

}
