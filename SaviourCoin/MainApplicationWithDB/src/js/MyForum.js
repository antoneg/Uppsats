import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import equal from 'fast-deep-equal'

class MyForum extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      forumName: '',
      address: '',
      username: '',
      ownsForum: false,
      addUserError: ''
    }

    this.createForum = this.createForum.bind(this);
    this.setup = this.setup.bind(this);
    this.addUser = this.addUser.bind(this);
    this.createForum = this.createForum.bind(this);
  }

  componentDidMount() {
    this.setup();
  }
 
  setup() {
    console.log(this.props.location.data.user.address);
    this.props.location.data.methods.getForumData(this.props.location.data.user.address).call((error, result) => {
      console.log(error);
      console.log(result);

      if(error || !result.forumName) {
        this.setState({ownsForum: false});
      } else {
        this.setState({ownsForum: true});
        this.setState({ forumName: result.forumName });
      }
    })
  }

  addUser(event) {
    event.preventDefault()
    if (this.state.address && this.state.username) {
      try{

      this.props.location.data.methods.addUserToForum(this.state.address, this.state.username, 100)
        .send({from: this.props.location.data.user.address, gas: 6721975}, (success) => {

        if(success) {
          this.setState({ addUserError: "User was added" });
          console.log("User was added");
          this.setState({address: ''});
          this.setState({username: ''});
        } else {
          this.setState({ addUserError: "User could not be added" });
          console.log("Error: User could not be added")
        }
      })
      } catch (e) {
        console.log(e);
        this.setState({ addUserError: "User could not be added" });
      }


    } else {
      this.setState({ addUserError: "You must enter an address and a username" });
    }
  }

  createForum(event) {
    event.preventDefault();
    if (this.state.forumName) {
      this.props.location.data.methods.createForum(this.state.forumName)
        .send({from: this.props.location.data.user.address, gas: 6721975}, (error, receipt) => {
          console.log("Error: " + error)
          console.log(receipt);
        if (receipt) {
          console.log('success')
          this.setState({ownsForum: true});
        } else {
          console.log('fail')
        }
      })
    } else {
      console.log("You must enter a Forum name");
    }
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
    if(this.state.ownsForum) {
    	return(
        <div className="container">
          <h1>{this.state.forumName}</h1>
          <p>Info goes here</p>
          <h3>Add user</h3>
          <div className="container register-form">
            <form onSubmit={this.addUser}>
                <label>Username</label>
                <input type="text" className="form-control" onChange={e => this.logChange(e, "username")}/>
                <label>User Address</label>
                <input type="text" className="form-control" onChange={e => this.logChange(e, "address")}/>
                <p>{this.state.addUserError}</p>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Create</button>
                </div>
            </form>
          </div>
        </div>
      );
    } else {
    return(
        <div className="container">
          <h1>Create Forum</h1>
          <div className="container register-form">
            <form onSubmit={this.createForum}>
                <label>Forum name:</label>
                <input type="text" className="form-control" onChange={e => this.logChange(e, "forumName")}/>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Create</button>
                </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default MyForum;