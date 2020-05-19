import React, { useState } from 'react';
//import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";

const Login = () => {
  const [usernameVar, setUsername] = useState('');
  const [passwordVar, setPassword] = useState('');
  const [errorMsgVar, setErrorMsg] = useState('');

  const history = useHistory();

  const handleUsernameInput = e => {
    setUsername(e.target.value);
  }

  const handlePasswordInput = e => {
    setPassword(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault()
    var data = {
        username: usernameVar,
        password: passwordVar
    }
    console.log(data)

    fetch("http://localhost:3000/users/auth", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
    }).then(function(data) {
        if(data.error) {
          setErrorMsg(data.error);
          console.log(data.error);
        } else {
          console.log(data);
        }
    }).catch(function(error) {
        console.log(error);
    });

    history.push({
        pathname: '/Home',
        state: {username: usernameVar}
    });
  }

//<Link to="CreateAccount">Create Account</Link>




  return (
      <div>
        <div className="container register-form">
          <form onSubmit={handleSubmit} method="POST">
              <label>Username</label>
              <input type="text" className="form-control" onChange={handleUsernameInput}/>
              <label>Password</label>
              <input type="text" className="form-control" onChange={handlePasswordInput}/>
              <div className="submit-section">
                  <button className="btn btn-uth-submit">Submit</button>
              </div>
          </form>
        </div>

        <p>{errorMsgVar}</p>

        
      </div>
  );
}

export default Login;