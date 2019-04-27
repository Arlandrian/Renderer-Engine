/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';
import WebGL from '../WebGL';
import 'bootstrap/dist/css/bootstrap.css';


/* const AppWrapper = styled.div`
  display: flex;
  margin-left: 320px;
  margin-top: 30px;
`; */

const Container = styled.div``;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  render() {
    return (
    <Container>
      <WebGL />
    </Container>

    );
  }
}
