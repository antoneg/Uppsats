import React, {Component} from 'react';
import {Link} from "react-router-dom"

class Login extends Component {
  render() {
    return (
        <div>
			    <h2>Login</h2>
			    <p>My Login page</p>
			    <Link to="Home">Home</Link>
			  </div>
    );
  }
}

export default Login;