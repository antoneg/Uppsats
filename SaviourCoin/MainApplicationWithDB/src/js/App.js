import React, { Component } from 'react';

import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import CreateAccount from './CreateAccount';
import MyForum from './MyForum';

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/"  component={Login}/>
          <Route path="/CreateAccount" component={CreateAccount} />
          <Route path="/Home" component={Home} />
          <Route path="/MyForum" component={MyForum} />
        </Switch>
      </main>
    );
  }
}

export default App;