import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Forum from '../../build/contracts/Forum.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
//import '../css/reactfix.css'
import equal from 'fast-deep-equal'
import {Link} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
      forums: [],
      from: '0x0',
      to: '0x0',
      balanceTo: 0,
      balanceFrom: 0,
      balance: 0,
      forumName: '',
      data: ''
    }

  this.transferCurrency = this.transferCurrency.bind(this)
  this.updateUser = this.updateUser.bind(this)
  this.setup = this.setup.bind(this)
  this.tempSetup = this.tempSetup.bind(this)
  this.createForum = this.createForum.bind(this)

  this.Web3 = require('web3')
  this.web3 = new Web3('HTTP://127.0.0.1:7545')

  this.contractJson = require('../../build/contracts/Forum.json')
  this.contractAddress = this.contractJson.networks[5777].address

  this.contract = new this.web3.eth.Contract(this.contractJson.abi, this.contractAddress)
  }

  componentDidMount() {
    this.updateUser();
    //setup should be called here instead
  }

  tempSetup() {
    this.contract.methods.createForum("Reddit").send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.createForum("Stackoverflow").send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.addUserToForum(this.state.from, "user", 100).send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
  }
 
  setup() {
    
    /*
    this.contract.methods.getMyForums().call((err, myForums) => {
      console.log("Error: " + err);
      console.log("Forum: " + myForums[0]);
    });*/

    /*
    this.contract.methods.getMyForums().send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    */
    
    /*
    this.contract.methods.createForum("Stackoverflow").send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    */
    
    this.contract.methods.getForumCount().call({gas: 6721975}, (err, id) => {
      var i;
      for(i = 1; i <= id; i++) {
        this.contract.methods.getMemberStatus(i).call({from: this.props.location.state.data[0].address}, (err, obj) => {
          //console.log(obj.success)
          if(obj.success) {
            //obj._fID
            this.contract.methods.getMyInfoByFid(obj._fID).call((err, result)=> {
              
              //console.log(result)

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

    //console.log(this.state.forums)
    
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

  transferCurrency(to, from, value) {
    this.contract.methods.transfer(to, value).send({from: from})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.updateUser()
  }

  createForum(event) {
    event.preventDefault()
    if (this.forumName == '') {
      console.log("You must enter a Forum name")
    } else {
    this.contract.methods.createForum(this.state.forumName).send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    }
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
            <ul className="list-group">
              {this.state.forums.map(forum => {
                return <li className="list-group-item" key={forum._fID}>
                  <h1>{forum._forumName}</h1> <br></br>
                  <p>Karma: {forum._karma}</p> <br></br>
                  <p>Checkout Price: {forum._checkOutPrice}</p>
                </li>
              })}
            </ul>
            <a href="#" onClick={() => this.tempSetup()}><button>Setup</button></a>
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