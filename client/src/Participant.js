import React, { Component } from 'react';
import DITEServer from "./common";

class ParticipantViewStandingBy extends Component {

  render() {
    return (
      <div className='Participant'>
        <p>Participant {this.props.Id} standing by...</p>
      </div>
    );
  }
}

class ParticipantViewTestOngoing extends Component {

  render() {
    return (
      <div className='Participant'>
        <p>Participant {this.props.Id} test ongoing...</p>
        <p>Image: {this.props.ImageSize}x{this.props.ImageSize}</p>
        <p>Row: {this.props.Row}, Col: {this.props.Col}</p>
      </div>
    );
  }
}

class Participant extends Component {

  state = { id : -1, test_image_size : -1,  test_row : -1, test_col : -1 }

  componentDidMount()
  {
    console.log('componentDidMount');
    this.timerID = setInterval( this.tick, 1000);
    DITEServer.query('link_participant',null, (r) => this.linked( r ) ) ;
  }

  componentWillUnmount()
  {
    console.log('componentWillUnmount');
    this.clearInterval(this.timerID);
  }

  tick = () =>
  {
    //console.log('tick');
    this.setState( { t : this.state.t + 1 } ) ;    
  }

  linked  = (r) =>
  {
    console.log('Participant linked');
    this.setState( { id: r.id } );
    DITEServer.query('get_test',null, (r) => this.process_test( r ) ) ;

  }

  process_test = (r) =>
  {
    console.log(`image_size=${r.size} row=${r.row} col=${r.col}`);
    this.setState( { test_image_size : r.size, test_row: r.row, test_col : r.col }) ;
  }
  
  render() {
 
    if ( this.state.test_image_size > 0 )
    {
      return (
        <div className='Participant'>
          <ParticipantViewTestOngoing Id={this.state.id} ImageSize={this.state.test_image_size} Row={this.state.test_row} Col={this.state.test_col}/>
        </div>
    );

    }
    else
    {
      return (
        <div className='Participant'>
          <ParticipantViewStandingBy Id={this.state.id}/>
        </div>
    );

    }
  }
}

export default Participant;
