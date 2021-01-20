import React from 'react'
// import useLocalStorage from '../hooks/useLocalStorage'
import './App.css';
import Login from './Login';
import Editor from './Editor';
import Menu from './Menu';
import Error from './Error';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";



function App() {
  //const [python, setPython] = useState('');
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact={true}>
            <Redirect to="/Login" />
          </Route>
          <Route path="/Login" exact={true}>
            <Login />
          </Route>
          <Route path="/Editor/:hash/:username" exact={true} >
            <Editor />
          </Route>

          <Route path="/Menu" exact={true}>
            <Menu />
          </Route>
          <Route path="*">
            <Error />
          </Route>

        </Switch>
      </div>
    </Router>
  )
}



export default App;
