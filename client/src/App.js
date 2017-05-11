import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Participant from "./Participant"
import Control from "./Control"
import Monitor from "./Monitor"

import "./App.css"

const App = () => ( <Router>
                       <div>
                         <ul className="hmenu">
                           <li className="hmenu-item"><Link to="/">Home</Link></li>
                           <li className="hmenu-item"><Link to="/control">Control</Link></li>
                           <li className="hmenu-item"><Link to="/monitor">Monitor</Link></li>
                         </ul>
                         <Route exact path="/" component={Participant} />
                         <Route path="/control" component={Control} />
                         <Route path="/monitor" component={Monitor} />
                       </div>
                     </Router>)

export default App;
