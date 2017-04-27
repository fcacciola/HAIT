import React, { Component } from 'react';
import DITEServer from "./common";

class Control extends Component {

  state = { m:"Not started", s : 0 } ;

  onStart = () =>
  {
    DITEServer.query('start',null, (r) => { console.log(r); this.setState(r) ; } ) ;
  }

  render() {

    return (
      <div className='Control'>
        <p>control</p>
        <p>{this.state.m}: {this.state.s}</p>
        <button type="button" onClick={this.onStart}>Start</button>
      </div>
    );
  }
}

export default Control;
