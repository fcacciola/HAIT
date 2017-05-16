import React, { Component } from 'react';

import { Grid, Message } from 'semantic-ui-react'

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

class imageArrayTile
{
  constructor(key_,id_,color_) 
  {
    this.key   = key_;
    this.id    = id_;
    this.color = color_;
  }
}

class paletteTile
{
  constructor(key_,color_) 
  {
    this.key   = key_;
    this.color = color_;
  }
}

class ParticipantViewTestOngoing extends Component {

  constructor(props)
  {
    super(props);

    this.imageArrayTiles = [];
    this.paletteTiles    = [];

    let n = 0 ;

    for( let r = 0 ; r < props.ImageSize ; ++ r )
    {
      for( let c = 0 ; c < props.ImageSize ; ++ c )
      {
        this.imageArrayTiles[n] = new imageArrayTile(n, r + ' x ' + c, r === props.Row && c === props.Col ? 'red' : 'grey') ;
        ++ n;
      }
    }

    for( let i = 0 ; i < props.Palette.length ; ++ i )
      this.paletteTiles[i] = new paletteTile(i,props.Palette[i]);
  }
  render() {
    return (
        <div >
          <Grid>
            <Grid.Row>
              <Message>This explain what is in here</Message> 
            </Grid.Row>  
            <Grid.Row>
              <Grid columns={this.props.ImageSize} celled>
                {this.imageArrayTiles.map((tile) => (
                        <Grid.Column
                          key={tile.key}
                          color={tile.color}
                          stretched={false}
                        >
                        {tile.id}
                        </Grid.Column>
                      ))}
              </Grid>
            </Grid.Row>  
          </Grid>   
          <Grid columns={this.paletteTiles.length} celled>
            {this.paletteTiles.map((tile) => (
                    <Grid.Column
                      key={tile.key}
                      color={tile.color}
                      stretched={false}
                    >
                    {tile.key}
                    </Grid.Column>
                  ))}
          </Grid>
        </div>
    );
  }
}

class Participant extends Component {

  state = { id : -1, test_image_size : -1,  test_row : -1, test_col : -1, palette : [] }

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
    this.setState( { test_image_size : r.size, test_row: r.row, test_col : r.col, palette : r.palette }) ;
  }
  
  render() {
 
    if ( this.state.test_image_size > 0 )
    {
      return ( <ParticipantViewTestOngoing Id={this.state.id} ImageSize={this.state.test_image_size} Row={this.state.test_row} Col={this.state.test_col} Palette={this.state.palette}/> );
    }
    else
    {
      return ( <ParticipantViewStandingBy Id={this.state.id}/> );
    }
  }
}

export default Participant;
