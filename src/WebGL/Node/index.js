//import { mat4 } from '../Utils/gl-matrix';
import { mat4, vec3 } from 'gl-matrix';
var Node = function(_name,instance,modelId) {
  this.name = _name;
  this.children = [];

  this.modelId = modelId;
  this.modelInstance = instance;

};

Node.prototype.setParent = function(parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};
//m4 ==> (A,B,DST)
//mat4 ==> (DST,A,B)
Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {
  
  var mi = this.modelInstance;
  if (parentWorldMatrix) {
    // a matrix was passed in so do the math
    mat4.multiply(mi.worldMatrix,parentWorldMatrix, mi.transformationMatrix);
  } else {
    // no matrix was passed in so just copy local to world
    mat4.copy( mi.model.worldMatrix, mi.transformationMatrix);
  }

  // now process all the children
  var worldMatrix = mi.worldMatrix;
  this.children.forEach(function(child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

export default Node;