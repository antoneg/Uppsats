import React, {Component} from 'react';
import {Link} from "react-router-dom";

class CreateAccount extends Component {
		constructor(props) {
    super(props)
    this.state = {
      username: '',
      address: '',
      password: '',
      msg: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
 	}

  handleSubmit(event) {
        event.preventDefault()
        if(this.state.username && this.state.address && this.state.password) {
	        var data = {
	            username: this.state.username,
	            address: this.state.address,
	            password: this.state.password
	        }
	      
	        fetch("http://localhost:3000/users/new", {
	            method: 'POST',
	            headers: {'Content-Type': 'application/json'},
	            body: JSON.stringify(data)
	        }).then(response => {
	            if (response.status >= 400) {
	              throw new Error("Bad response from server");
	            }
	            return response.json();
	        }).then(obj => {
	            if(obj.code) {
	            	if (obj.code == 'ER_DUP_ENTRY') {
	            		this.setState({msg: "A user with that username or address already exists."});
	            	} else {
	            		this.setState({msg: "Unkown database error."});
	            	}
	            } else  {
	              this.setState({msg: "Thank you for registering!"});
	              this.setState({
		              username: '',
		              address: '',
		              password: ''
	              });
	            }
	        }).catch(function(error) {
	            console.log(error);
	        });
        } else {
        	this.setState({msg: "Please enter username, address and password."});
        }
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
    return (
        <div className="container">
        <h1>Create Account</h1>
					<div className="container register-form">
		        <form onSubmit={this.handleSubmit} method="POST">
		            <label>Username</label>
		            <input type="text" className="form-control" value={this.state.username} onChange={e => this.logChange(e, "username")}/>
		            <label>Address</label>
		            <input type="text" className="form-control" value={this.state.address} onChange={e => this.logChange(e, "address")}/>
		            <label>Password</label>
		            <input type="password" className="form-control" value={this.state.password} onChange={e => this.logChange(e, "password")}/>
		            <p>{this.state.msg}</p>
		            <div className="submit-section">
		                <button className="btn btn-uth-submit">Submit</button>
		            </div>
		        </form>
		      </div>

			    <Link to="/">Back to login</Link>
			  </div>
    );
  }
}

export default CreateAccount;