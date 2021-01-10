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
  Link,
  Redirect
} from "react-router-dom";



function App() {
  //const [python, setPython] = useState('');
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/Editor">Editor</Link>
            </li>
            <li>
              <Link to="/Menu">Menu</Link>
            </li>
            <li>
              <Link to="/Error">Error</Link>
            </li>
            
            <li>
              <Link>Download</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact={true}>
            <Redirect to="/Login" />
          </Route>
          <Route path="/Login" exact={true}>
            <Login/>
          </Route>
          {/* <Route path="/Editor/:hash" exact={true} component={() => {return <Editor/>;}}>
            
          </Route> */}
          <Route path="/Editor/:hash" exact={true} >
            <Editor/>  
          </Route>
          
          <Route path="/Menu" exact={true}>
            <Menu/>
          </Route>
          <Route path="*">
            <Error/>
          </Route>
          
        </Switch>
      </div>
    </Router>
  )
}



export default App;
