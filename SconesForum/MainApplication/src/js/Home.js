import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Forum from '../../build/contracts/Forum.json';
import 'bootstrap/dist/css/bootstrap.css';
import equal from 'fast-deep-equal';
import {Link} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forums: [],
      balance: 0,
      data: '',
      msg: "You are currently not a member of any forum."
    }  

  this.setup = this.setup.bind(this);
  this.cashOut = this.cashOut.bind(this);

  this.Web3 = require('web3');
  this.web3 = new Web3('http://localhost:7545');

  this.contractJson = require('../../build/contracts/Forum.json');
  this.contractAddress = this.contractJson.networks[5777].address;
  this.contract = new this.web3.eth.Contract(this.contractJson.abi, this.contractAddress);
  }

  componentDidMount() {
    this.setup();
  }
 
  setup() {
    this.contract.methods.getForumCount().call({gas: 6721975}, (err, id) => {
      var i;
      for(i = 1; i <= id; i++) {
        this.contract.methods.getMemberStatus(i).call({from: this.props.location.state.data[0].address}, (err, obj) => {
          if(obj.success) {
            this.setState({msg: ''});
            this.contract.methods.getMyInfoByFid(obj._fID).call({from: this.props.location.state.data[0].address}, (error, result)=> {
              this.setState(prevState => ({
                forums: [...prevState.forums, result]
              }))
            })
          }
        })
      }
    });
    
    this.contract.methods.balanceOf(this.props.location.state.data[0].address).call((err, result) => {
      this.setState({ balance: result })
    })
  }

  cashOut(forumAddress) {
    this.contract.methods.cashOut(forumAddress)
      .send({from: this.props.location.state.data[0].address, gas: 6721975}, (error, result) => {
        if (!error) {
          console.log('success');
        } else {
          console.log('fail');
        }
      })
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
  	return(
      <div className="container-fluid">
        <div className="row">

          <div className="col-4">
            <div>
              <p>Username: {this.props.location.state.data[0].username}</p>
              <p>Address: {this.props.location.state.data[0].address}</p>
              <p>Balance: {this.state.balance}</p>
            </div>
          </div>

          <div className="col-4">
            <p>{this.state.msg}</p>
            <ul className="list-group">
              {this.state.forums.map(forum => {
                return <li className="list-group-item" key={forum._fID}>
                  <h1>{forum._forumName}</h1> <br></br>
                  <p>Karma: {forum._karma}</p> <br></br>
                  <p>Cash Out Price: {forum._cop}</p><br></br>
                  <button onClick={() => this.cashOut(forum._forumAddress)}>Cashout</button>
                </li>
              })}
            </ul>
          </div>

          <div className="col-4">
            <Link to={{
              pathname:'MyForum',
              data: {
                user: this.props.location.state.data[0],
                methods: this.contract.methods
              }
            }}> MyForum </Link>
          </div>

        </div>
      </div>
    )
  }
}

export default Home;