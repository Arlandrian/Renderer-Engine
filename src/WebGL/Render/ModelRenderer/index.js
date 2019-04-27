import GLC from '../../GLCommander';
import Shader from '../../Shaders/ModelShader';
import Node from '../../Node';
import ModelInstance from '../../Models/ModelInstance';
import { mat4, vec3 } from 'gl-matrix';


export default class ModelRenderer {

    constructor(){
        this.shader = new Shader();
        this.models = {};
        let originModelInstance =new ModelInstance(0,0,0,0,0,0);
        this.originNode = new Node('origin',originModelInstance,null);
        this.tree = this.originNode;
    }

    registerNewModel = (model, id) => {
        if(!this.models[id]) {
            this.models[id] = {
                type: model,
                instances: []
            }
        }
    }

    addToTree(name,instance,modelId){
        var newNode = new Node(name,instance,modelId);

        newNode.setParent(this.originNode);
        //this.tree.children.push(newNode);

    }

    addInstance = (instance, id, name) => {
        this.models[id].instances.push(instance);
        this.addToTree(name,instance,id);
    }

    preRender = () => {
        GLC.viewport();
        GLC.depthTest(true);
    }

    updateWorldMatrix(parentNode){
        var mi = parentNode.modelInstance;
        
        if (parentNode.modelId) {
        // a matrix was passed in so do the math
            mat4.multiply(mi.worldMatrix, mi.getTransformationMatrix(), mi.getWorldMatrix());
        } else {
        // no matrix was passed in so just copy local to world
            mat4.copy( mi.worldMatrix,mi.transformationMatrix);
        }
        
        // now process all the children
        //var worldMatrix = this.worldMatrix;
        parentNode.children.forEach(
            function(child) {
                this.updateWorldMatrix(child);
            },this
        );  
    }

    drawNode(node){
        this.models[node.modelId].type.use(this.shader);
        let wMatrix = node.modelInstance.getWorldMatrix();
        this.shader.enableTransformationMatrix(wMatrix);
        GLC.drawTriangles(this.models[node.modelId].type.indices.length);
    }

    traverse(node) {
        for(let i = 0; i < node.length ; i++){
            this.drawNode(node[i]);
            if(node[i].children.length > 0){
                this.traverse(node[i].children);
            }
        }
    }

    drawObjects(){
        this.traverse(this.tree.children);
    }

    render = (light, camera) => {

        this.preRender();
        this.shader.use();
        this.shader.enableLight(light);
        camera.enable(this.shader);
        
        this.originNode.updateWorldMatrix(this.originNode.modelInstance.worldMatrix);

        this.drawObjects();
    }
}
