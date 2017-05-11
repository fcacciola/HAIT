import React, { Component } from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {deepOrange500} from 'material-ui/styles/colors';
import {GridList, GridTile} from 'material-ui/GridList';

import DITEServer from "./common";

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class ParticipantViewStandingBy extends Component {

  render() {
    return (
      <div className='Participant'>
        <p>Participant {this.props.Id} standing by...</p>
      </div>
    );
  }
}

const TestOngoing_Styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
  gridTileA: { color: '#CCCCCC'},
  gridTileB: { color: '#FF0000'}
};

class imageArrayTile
{
  constructor(key_,id_,style_) 
  {
    this.key   = key_;
    this.id    = id_;
    this.style = style_;
  }
}

class ParticipantViewTestOngoing extends Component {

  constructor(props)
  {
    super(props);

    this.imageArrayTiles = [];

    let n = 0 ;

    for( let r = 0 ; r < props.ImageSize ; ++ r )
    {
      for( let c = 0 ; c < props.ImageSize ; ++ c )
      {
        this.imageArrayTiles[n++] = new imageArrayTile(n, r + ' x ' + c, r === props.Row && c === props.Col ? TestOngoing_Styles.gridTileA : TestOngoing_Styles.gridTileB) ;
      }
    }

  }
  render() {
    return (
      <div className='Participant' style={TestOngoing_Styles.root}>
        <GridList style={TestOngoing_Styles.gridList}>
          {this.imageArrayTiles.map((tile) => (
                  <GridTile
                    key={tile.key}
                    title={tile.id}
                    style={tile.style}
                  >
                  </GridTile>
                ))}
        </GridList>
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
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='Participant'>
            <ParticipantViewTestOngoing Id={this.state.id} ImageSize={this.state.test_image_size} Row={this.state.test_row} Col={this.state.test_col}/>
          </div>
        </MuiThemeProvider>
    );

    }
    else
    {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='Participant'>
            <ParticipantViewStandingBy Id={this.state.id}/>
          </div>
        </MuiThemeProvider>
    );

    }
  }
}

export default Participant;
