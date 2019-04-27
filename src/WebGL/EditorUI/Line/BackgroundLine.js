import React, { Component } from 'react';
import './style.css';

class BackgroundLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.lineType,
      // values: vec3.fromValues(1,1,1)
      x: 0,
      y: 0,
      z: 0,
    };
  }

  render() {
    return (
      <div>
        <div className="background-line">
          <h4>Background Color</h4>
          <input placeholder="R" onChange={this.xOnChange} />
          <input placeholder="G" onChange={this.yOnChange} />
          <input placeholder="B" onChange={this.zOnChange} />
        </div>
      </div>
    );
  }

  xOnChange = e => {
    this.setState({
      // values:vec3.fromValues(e.target.value,this.state.values[1],this.state.values[2])
      x: e.target.value,
    });
    this.props.changeBG(
      parseFloat(this.state.x) / 255,
      parseFloat(this.state.y) / 255,
      parseFloat(this.state.z) / 255,
    );
  };

  yOnChange = e => {
    this.setState({
      y: e.target.value,
    });
    this.props.changeBG(
      parseFloat(this.state.x) / 255,
      parseFloat(this.state.y) / 255,
      parseFloat(this.state.z) / 255,
    );
  };

  zOnChange = e => {
    this.setState({
      z: e.target.value,
    });
    this.props.changeBG(
      parseFloat(this.state.x) / 255,
      parseFloat(this.state.y) / 255,
      parseFloat(this.state.z) / 255,
    );
  };
}

export default BackgroundLine;
