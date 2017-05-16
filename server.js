const express = require('express');
const fs = require('fs');
const sqlite = require('sql.js');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

class Participant{

  constructor(ip,id){
    this.ip = ip ;
    this.id = id ;
  }

  setLocation(c,r){
    this.col = c ;
    this.row = r ;
  }
}

class Test
{
  constructor(image_size){
    this.image_size = image_size ;
  }
}

let gParticipants = new Map() ;
let gParticipantsCount = 0 ;
let gCurrentTest = undefined ;

gParticipants.set(-1, new Participant(-1,gParticipantsCount++ )) ;
gParticipants.set(-2, new Participant(-2,gParticipantsCount++ )) ;
gParticipants.set(-3, new Participant(-3,gParticipantsCount++ )) ;

app.get('/api/link_participant', (req, res) => {

  let participant_ip = String(req.ip) ;
  console.log(`link_participant. ip=${participant_ip} id=${gParticipantsCount}`);
  let participant ;
  if ( gParticipants.has(participant_ip))
  {
    participant = gParticipants.get(participant_ip);
  }
  else 
  {
    participant = new Participant(participant_ip,gParticipantsCount);
    ++ gParticipantsCount ;
    gParticipants.set( participant_ip, participant);
  }

  if ( gParticipantsCount % 2 == 0 && gParticipantsCount >= 4 )
  {
    gCurrentTest = new Test( Math.sqrt(gParticipantsCount) ) ;
  }

  res.json({id:participant.id})
});

app.get('/api/start', (req, res) => {

  res.json({m: "Started", s:gParticipantsCount})
});


app.get('/api/get_test', (req,res) => {

  let res_size    = 0 ;
  let res_row     = -1 ;
  let res_col     = -1 ;
  let res_palette = ['red', 'blue'];

  let participant_ip = String(req.ip) ;
  let participant_id = -1 ;

  if ( gParticipants.has(participant_ip))
    participant_id = gParticipants.get(participant_ip).id;

  console.log(`get_test call from participant  ${participant_id}`);

  if ( gCurrentTest != undefined && participant_id != -1 )
  {
      res_size = gCurrentTest.image_size ;
      res_row = Math.floor( participant_id / gCurrentTest.image_size );
      res_col = participant_id - ( res_row * gCurrentTest.image_size ) ;
  }
  else
  {
     console.log("No test setup yet");
  }

  res.json( { size: res_size, row: res_row, col : res_col, palette : res_palette} )  ;
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
