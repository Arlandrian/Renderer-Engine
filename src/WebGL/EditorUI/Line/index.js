import React, { Component } from 'react';
import './style.css';
import { vec3 } from 'gl-matrix';
class Line extends Component {
  constructor(props) {
    super(props);
    this.onNodeSelect = this.onNodeSelect;
    if (props.lineType === 'Scale') {
      this.state = {
        type: props.lineType,
        // values: vec3.fromValues(1,1,1)
        x: 1,
        y: 1,
        z: 1,
      };
    } else {
      this.state = {
        type: props.lineType,
        // values: vec3.fromValues(1,1,1)
        x: 0,
        y: 0,
        z: 0,
      };
    }
  }

  render() {
    return (
      <div>
        <div className="line">
          <button onClick={this.handleClick}>{this.state.type}</button>
          <input ref="xx" value={this.state.x} placeholder="x" onChange={this.xOnChange} />
          <input ref="yy" value={this.state.y} placeholder="y" onChange={this.yOnChange} />
          <input ref="zz" value={this.state.z} placeholder="z" onChange={this.zOnChange} />
        </div>
      </div>
    );
  }

  onNodeSelect = (transform) =>{
    switch (this.state.type) {
      case 'Position':
        
        this.setState({
          x:transform.position[0],
          y:transform.position[1],
          z:transform.position[2]
        });
        
        break;
      case 'Rotation':
        this.setState({
          x:transform.rotation[0],
          y:transform.rotation[1],
          z:transform.rotation[2]
        });
        break;
      case 'Scale':
        this.setState({
          x:transform.scale[0],
          y:transform.scale[1],
          z:transform.scale[2]
        });
        break;
    }
  }; 

  handleChange(val,type){
    var x,y,z;

    if(type == 0){//x
      this.setState({
        x: val
      });
      x = this.myParseFloat(val);

      y = this.state.y;
      z = this.state.z;
    }else if(type == 1){//y
      this.setState({
        y: val
      });
      y = this.myParseFloat(val);

      x = this.state.x;
      z = this.state.z;
    }else if(type == 2){//z
      this.setState({
        z: val
      });
      z = this.myParseFloat(val);

      x = this.state.x;
      y = this.state.y;
    }

    this.props.action(x,y,z);

  }

  xOnChange = e => {
    const val = e.target.value == '' ? 0 : e.target.value;
    this.handleChange(val,0);
  };

  yOnChange = e => {
    const val = e.target.value == '' ? 0 : e.target.value;
    this.handleChange(val,1);
  };

  zOnChange = e => {
    const val = e.target.value == '' ? 0 : e.target.value;
    this.handleChange(val,2);
  };

  handleClick = () => {
    const x = this.myParseFloat(this.state.x);
    const y = this.myParseFloat(this.state.y);
    const z = this.myParseFloat(this.state.z);
    switch (this.state.type) {
      case 'Position':
        this.props.translate(x,y,z);
        break;
      case 'Rotation':
        this.props.rotate(x, y, z);
        break;
      case 'Scale':
        this.props.scale(x, y, z);
        break;
      case 'Background':
        this.props.changeBG(x, y, z);
    }
  };

  myParseFloat(str){
    while(str[0] === '0' && str.length > 1){
      str = str.substr(1);
    }
    return parseFloat(str);
  }

  
}

export default Line;
