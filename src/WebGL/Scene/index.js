import GLC from '../GLCommander';
import ModelRenderer from '../Render/ModelRenderer';
import ModelType from '../Models/ModelType';
import ModelInstance from '../Models/ModelInstance';
import Cube from './cube';
import Light from '../LightSource';
import Material from '../Materials/material';
import Camera from '../Camera';
import MouseEvent from '../EventHandlers/mouse';
import { vec3 } from 'gl-matrix';
import Event from '../Event';

const objToJson = (str) =>{
  let lines = str.split('\n');
  let vertices = [];
  let indices = [];
  let normals = [];
  let textureCoords = [];
  for(let i = 0 ; i < lines.length ; i++){
    let parts = lines[i].split(' ');
    switch(parts[0]){
      case 'vt'://textCoordinates - UVs
        textureCoords.push(parseFloat(parts[1]));
        textureCoords.push(parseFloat(parts[2]));
        break;
      case 'v'://vertices - vertex
        vertices.push(parseFloat(parts[1]));
        vertices.push(parseFloat(parts[2]));
        vertices.push(parseFloat(parts[3]));
        break;
      case 'f'://faces - triangles - indices
        for(let j = 1 ; j < parts.length ; j++){
          let col = parts[j].split('/');
          indices.push(parseFloat(col[1])-1);
        }
        break;
      case 'vn'://normals
        normals.push(parseFloat(parts[1]));
        normals.push(parseFloat(parts[2]));
        normals.push(parseFloat(parts[3]));
        break;
    }
  }
  return {vertices,indices,normals,textureCoords};
}

export default function Scene(id,webglInstance) {
  this.canvas = document.querySelector(`#${id}`);
  this.webglInstance = webglInstance;
  if (!this.canvas) {
    return;
  }

  this.gl = this.canvas.getContext('webgl');

  if (!this.gl) {
    return;
  }

  GLC.init(this.gl);
  MouseEvent.init();

  this.camera = new Camera(0, 2, 40);
  this.light = new Light(100, -100, -100, 1.0, 1.0, 1.0, 0.4);

  const vertices = Cube.vertices;
  const indices = Cube.indices;
  const normals = Cube.normals;
  const textureCoords = Cube.textureCoords;

  this.modelRenderer = new ModelRenderer();

  const createNewModel = (name, file) => {
    const material = new Material();
    switch (file) {
      case 'green':
        material.addDiffuse(require('../resources/green.png'));
        break;
      case 'blue':
        material.addDiffuse(require('../resources/blue.png'));
        break;
      case 'red':
        material.addDiffuse(require('../resources/red.png'));
        break;
    }

    const modelType = new ModelType(vertices, indices, normals, textureCoords);
    modelType.addMaterial(material);
    this.modelRenderer.registerNewModel(modelType, name);
  };

  //const blenderInstance = new ModelInstance(0, 5, 0, 0, 0, 0);
  //this.modelRenderer.addInstance(blenderInstance, 'blender', 'blenderCube');

  createNewModel('cubeR', 'red');
  createNewModel('cubeB', 'blue');
  createNewModel('cubeG', 'green');

  const importObj = (mesh) => {
    const material = new Material();
    switch ('red') {
      case 'green':
        material.addDiffuse(require('../resources/green.png'));
        break;
      case 'blue':
        material.addDiffuse(require('../resources/blue.png'));
        break;
      case 'red':
        material.addDiffuse(require('../resources/red.png'));
        break;
    }

    const modelType = new ModelType(mesh.vertices, mesh.indices, mesh.normals, mesh.textureCoords);
    modelType.addMaterial(material);
    this.modelRenderer.registerNewModel(modelType, 'obj');

    const instance = new ModelInstance(0, 5, 0, 0, 0, 0);
    this.modelRenderer.addInstance(instance, 'obj', 'importedObject');
  }

  let modelFileStatic = require("../resources/tre_uvs_nomat.obj");
  let meshData = fetch(modelFileStatic)
  .then((resp) => {
    return resp.text();
  }).then( (str) => {
    return objToJson(str);//meshData
  }).then( mesh => {
    importObj(mesh);
  });
  

  const instance = new ModelInstance(0, 0, 0, 0, 0, 0);
  const instance2 = new ModelInstance(3, 0, 0, 0, 0, 0);
  const instance3 = new ModelInstance(-3, 0, 0, 0, 0, 0);

  this.modelRenderer.addInstance(instance, 'cubeR', 'redBox');
  this.modelRenderer.addInstance(instance2, 'cubeB', 'blueBox');
  this.modelRenderer.addInstance(instance3, 'cubeG', 'greenBox');

  this.Update = new Event(this);
  this.webglInstance.UpdateEvent = this.Update;
  this.time = 0;
  this.backgroundColor = [1.0, 1.0, 1.0];

  const render = () => {
    this.time += 0.005;
    GLC.clear(...this.backgroundColor, 1.0);

    instance.translate(0, Math.sin(this.time * 8) * 0.02, 0);

    let k = (Math.sin(this.time*16) * 0.01)+1;
    instance3.scale(k, k, k);
    
    this.Update.notify(this.webglInstance);


    this.modelRenderer.render(this.light, this.camera);
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
}

