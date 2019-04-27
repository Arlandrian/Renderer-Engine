import { createTransformationMatrix } from '../../Utils/maths';
import { mat4, vec3 } from 'gl-matrix';

export default class ModelInstance {
    constructor(x, y, z, rx , ry, rz){
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.sx = 1;
        this.sy = 1;
        this.sz = 1;
        
        this.generateTransformationMatrix();//LocalMatrix
        this.generateWorldMatrix();
    }

    setNode = (_node) => {
        this.node = _node;
    }

    setPosition = (x,y,z)=>{
        this.x = x;
        this.y = y;
        this.z = z;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();
    }

    setRotation = (x,y,z)=>{
        this.rx = x;
        this.ry = y;
        this.rz = z;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();
    }

    setScale = (x,y,z)=>{
        this.sx = x;
        this.sy = y;
        this.sz = z;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();
    }

    updateRotation = (rx, ry, rz) => {
        this.rx += rx;
        this.ry += ry;
        this.rz += rz;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();

    }

    translate =(x,y,z)=>{
        this.x += x;
        this.y += y;
        this.z += z;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();
    }

    scale=(x,y,z)=>{
        this.sx *= x;
        this.sy *= y;
        this.sz *= z;
        this.generateTransformationMatrix();
        this.generateWorldMatrix();
    }

    generateTransformationMatrix = () => {
        this.transformationMatrix = createTransformationMatrix(this.x, this.y, this.z, this.rx, this.ry, this.rz, this.sx,this.sy,this.sz);
    }

    generateWorldMatrix = () => {
        this.worldMatrix = createTransformationMatrix(this.x, this.y, this.z, this.rx, this.ry, this.rz, this.sx,this.sy,this.sz);
    }

    getTransformationMatrix = () => this.transformationMatrix;
    getWorldMatrix = () => this.worldMatrix;

}