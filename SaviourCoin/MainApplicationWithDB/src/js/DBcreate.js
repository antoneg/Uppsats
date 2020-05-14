import React from 'react'


class DBcreate extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: '',
      msg: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
 	}

  handleSubmit(event) {
        
        event.preventDefault()
        var data = {
            title: this.state.title,
            body: this.state.body
        }
        console.log(data)
      
        fetch("http://localhost:3000/blogs/new", {
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
        }).catch(function(err) {
            console.log(err)
        });
        
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
    return (
      <div className="container register-form">
        <form onSubmit={this.handleSubmit} method="POST">
            <label>Title</label>
            <input type="text" className="form-control" onChange={e => this.logChange(e, "title")}/>
            <label>Body</label>
            <input type="text" className="form-control" onChange={e => this.logChange(e, "body")}/>
            <div className="submit-section">
                <button className="btn btn-uth-submit">Submit</button>
            </div>
        </form>
      </div>
    )
  }
}

export default DBcreate