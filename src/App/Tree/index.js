import React, { Component } from 'react';

import cx from 'classnames';

import './style.css';
import './lib/react-ui-tree.css';

// import treeData from './tree';

import Tree from './lib/react-ui-tree.js';

export default class TreeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      tree: props.treeData,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tree: nextProps.treeData });
  }

  renderNode = node => (
    <span
      className={cx('node', {
        'is-active': node === this.state.active,
      })}
      onClick={this.onClickNode.bind(null, node)}
    >
      {node.name}
    </span>
  );

  onClickNode = node => {
    this.setState({
      active: node,
    });

    this.props.onSelect(node);
  };

  render() {
    return (
      <div className="tree">
        <Tree
          paddingLeft={20}
          tree={this.state.tree}
          onChange={this.handleChange}
          isNodeCollapsed={this.isNodeCollapsed}
          renderNode={this.renderNode}
        />
      </div>
    );
  }

  handleChange = tree => {
    this.setState({
      tree,
    });
  };

  updateTree = () => {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
    this.setState({
      tree,
    });
  };
}
