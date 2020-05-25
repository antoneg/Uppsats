import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import equal from 'fast-deep-equal';

class MyForum extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      forumName: '',
      address: '',
      username: '',
      balance: '',
      ownsForum: false,
      addUserMsg: '',
      cashOutPrice: '',
      setCashOutMsg: '',
      createForumMsg: ''
    }

    this.setup = this.setup.bind(this);
    this.setCashOutPrice = this.setCashOutPrice.bind(this);
    this.addUser = this.addUser.bind(this);
    this.createForum = this.createForum.bind(this);
  }

  componentDidMount() {
    this.setup();
  }
 
  setup() {
    this.props.location.data.methods.getForumData(this.props.location.data.user.address).call((error, result) => {
      if(error || !result.forumName) {
        this.setState({ownsForum: false});
      } else {
        this.setState({
          ownsForum: true,
          forumName: result.forumName,
          cashOutPrice: result.cop
        });
      }
    })

    this.props.location.data.methods.balanceOf(this.props.location.data.user.address).call((err, result) => {
      this.setState({ balance: result });
    })
  }

  setCashOutPrice(event) {
    event.preventDefault();
    if (this.state.price) {
      this.props.location.data.methods.setCashOutPrice(this.state.price)
        .send({from: this.props.location.data.user.address, gas: 6721975}, (error, result) => {
        if (error) {
          this.setState({setCashOutMsg: "To high. Aquire more scones or try a lower COP."});
        } else {
          this.setState({
            cashOutPrice: this.state.price,
            setCashOutMsg: ""
          });
        }
      })
    } else {
      this.setState({setCashOutMsg: "You must enter a price"});
    }
  }

  addUser(event) {
    event.preventDefault();
    if (this.state.address && this.state.username) {
      try{
        this.props.location.data.methods.addUserToForum(this.state.address, this.state.username, 100)
          .send({from: this.props.location.data.user.address, gas: 6721975}, (error, result) => {
          if(error) {
            this.setState({ addUserMsg: "User could not be added" });
          } else {
            this.setState({ 
              addUserMsg: "User was added",
              address: '',
              username: ''
            });
          }
        })
      } catch (e) {
        console.log(e);
        this.setState({ addUserMsg: "The user does not exist" });
      }
    } else {
      this.setState({ addUserMsg: "You must enter an address and a username" });
    }
  }

  createForum(event) {
    event.preventDefault();
    if (this.state.forumName) {
      this.props.location.data.methods.createForum(this.state.forumName)
        .send({from: this.props.location.data.user.address, gas: 6721975}, (error, result) => {
        if (error) {
          console.log('fail');
        } else {
          console.log('success');
          this.setState({ownsForum: true});
        }
      })
    } else {
      this.setState({createForumMsg: "You must enter a Forum name"});
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
          <p>Balance: {this.state.balance}</p>
          <p>Cash Out Price: {this.state.cashOutPrice}</p>


          <h3>Set Cash Out Price</h3>
          <div className="container register-form">
            <form onSubmit={this.setCashOutPrice}>
                <label>Price in scones/karma</label>
                <input type="text" className="form-control" value={this.state.price} onChange={e => this.logChange(e, "price")}/>
                <p>{this.state.setCashOutMsg}</p>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Set</button>
                </div>
            </form>
          </div>

          <h3>Add user</h3>
          <div className="container register-form">
            <form onSubmit={this.addUser}>
                <label>Username</label>
                <input type="text" className="form-control" value={this.state.username} onChange={e => this.logChange(e, "username")}/>
                <label>User Address</label>
                <input type="text" className="form-control" value={this.state.address} onChange={e => this.logChange(e, "address")}/>
                <p>{this.state.addUserMsg}</p>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Add user</button>
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
                <p>{this.state.createForumMsg}</p>
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