import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Forum from '../../build/contracts/Forum.json';
import 'bootstrap/dist/css/bootstrap.css';
//import '../css/reactfix.css';
import equal from 'fast-deep-equal';
import {Link} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      forums: [],
      balance: 0,
      forumName: '',
      data: '',
      msg: "You are currently not a member of any forum."
    }

  this.updateUser = this.updateUser.bind(this);
  this.setup = this.setup.bind(this);
  this.cashOut = this.cashOut.bind(this);

  this.Web3 = require('web3');
  this.web3 = new Web3('HTTP://127.0.0.1:7545');

  this.contractJson = require('../../build/contracts/Forum.json');
  this.contractAddress = this.contractJson.networks[5777].address;

  this.contract = new this.web3.eth.Contract(this.contractJson.abi, this.contractAddress);
  }

  componentDidMount() {
    this.updateUser();
    //setup should be called here instead. Can call updateUser in setup instead.
  }

  tempSetup() {
    this.contract.methods.createForum("Reddit").send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.createForum("Stackoverflow").send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.addUserToForum(this.state.from, "user", 10).send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
  }
 
  setup() {
    this.contract.methods.getForumCount().call({gas: 6721975}, (err, id) => {
      var i;
      for(i = 1; i <= id; i++) {
        this.contract.methods.getMemberStatus(i).call({from: this.props.location.state.data[0].address}, (err, obj) => {
          //console.log(obj)
          if(obj.success) {
            this.setState({msg: ''});
            this.contract.methods.getMyInfoByFid(obj._fID).call({from: this.props.location.state.data[0].address}, (error, result)=> {
              //console.log(error);
              //console.log(result);
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

  updateUser() {
    this.web3.eth.getAccounts().then((accs) => {
      this.setState({ accounts: accs })

      this.setState({ from: this.state.accounts[0] })
      this.setState({ to: this.state.accounts[1] })
      
      this.contract.methods.balanceOf(this.state.to).call((err, result) => {
        this.setState({ balanceTo: result })
      })
      this.contract.methods.balanceOf(this.state.from).call( (err, result) => {
        this.setState({ balanceFrom: result })
      })

      this.setup();
    })
  }

  cashOut(forumAddress) {
    this.contract.methods.cashOut(forumAddress)
      .send({from: this.props.location.state.data[0].address, gas: 6721975}, (error, result) => {
          console.log(error);
        if (result) {
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