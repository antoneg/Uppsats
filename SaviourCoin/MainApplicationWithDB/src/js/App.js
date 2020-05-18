import React, { Component } from 'react';

import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from './Home';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/"  component={Login}/>
          <Route path="/Home" component={Home} />
        </Switch>
      </main>
    );
  }
}

export default App;