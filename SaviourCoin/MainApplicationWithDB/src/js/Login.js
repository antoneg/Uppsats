import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";

  //Allows us to use hooks on data from class.
  //Will generate a warning which can be ignored.
  const HistoryHook = (props) => {
      if(props.data) {
          const history = useHistory();
          history.push({
              pathname: '/Home',
              state: {data: props.data}
          });
      }

      return(
      <div>
          <p></p>
      </div>
      );
  };

class Login extends Component {
    constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      msg: '',
      data: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
     }

  handleSubmit(event) {
    event.preventDefault()
    if(this.state.username && this.state.password) {
        var data = {
            username: this.state.username,
            password: this.state.password
        }
      
        let currentComponent = this;

        fetch("http://localhost:3000/users/auth", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(obj => {
            console.log(obj);
            if(obj.error) {
                currentComponent.setState({ msg: obj.error });
                console.log(obj.error);
            } else {
                currentComponent.setState({ data: obj});
            }
        }).catch(function(error) {
            console.log(error);
        });
    } else {
        this.setState({msg: "Please enter username and password."});
    }
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
    return (
        <div className="container">
            <h1>Login</h1>
          <div className="container register-form">
            <form onSubmit={this.handleSubmit} method="POST">
                <label>Username</label>
                <input type="text" className="form-control" onChange={e => this.logChange(e, "username")}/>
                <label>Password</label>
                <input type="password" className="form-control" onChange={e => this.logChange(e, "password")}/>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Submit</button>
                </div>
            </form>
          </div>

          <p>{this.state.msg}</p>

          <Link to="CreateAccount">Create Account</Link>

          <HistoryHook data={this.state.data} />

        </div>
    );
  }
}

export default Login;