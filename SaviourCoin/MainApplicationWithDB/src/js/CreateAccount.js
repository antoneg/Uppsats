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
        var data = {
            username: this.state.username,
            address: this.state.address,
            password: this.state.password
        }
        console.log(data)
      
        fetch("http://localhost:3000/users/new", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            console.log(data)    
            if(data == "success"){
               this.setState({msg: "Thanks for registering"});  
            }
        }).catch(function(error) {
            console.log(error);
        });
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
    return (
        <div>
					<div className="container register-form">
		        <form onSubmit={this.handleSubmit} method="POST">
		            <label>Username</label>
		            <input type="text" className="form-control" onChange={e => this.logChange(e, "username")}/>
		            <label>Address</label>
		            <input type="text" className="form-control" onChange={e => this.logChange(e, "address")}/>
		            <label>Password</label>
		            <input type="text" className="form-control" onChange={e => this.logChange(e, "password")}/>
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